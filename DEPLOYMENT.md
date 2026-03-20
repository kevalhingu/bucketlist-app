# Deployment Guide – BucketList on AWS

This guide walks you through deploying the BucketList app on AWS step by step using the AWS Console. No CLI required for the AWS parts.

By the end you will have:
- A DynamoDB table storing your goals
- A Docker image pushed to ECR
- The app running on ECS Fargate
- A Load Balancer serving the app on a public URL

---

## What we are building

```
Browser → Load Balancer (port 80) → ECS Fargate Container (port 3000) → DynamoDB
```

---

## Part 1 — Create the DynamoDB Table

1. Go to [https://console.aws.amazon.com](https://console.aws.amazon.com) and log in
2. In the search bar at the top, type **DynamoDB** and click it
3. Click the orange **Create table** button
4. Fill in the details:
   - Table name: `BucketListGoals`
   - Partition key: `goalId`
   - Partition key type: **String**
5. Scroll to the bottom and click **Create table**
6. Wait until the table status shows **Active** (takes about 30 seconds)

---

## Part 2 — Create an IAM Role for ECS

This role gives your container permission to read and write to DynamoDB without needing any access keys.

1. In the search bar type **IAM** and click it
2. On the left sidebar click **Roles**
3. Click **Create role**
4. Under **Trusted entity type** select **AWS service**
5. Under **Use case** scroll down and select **Elastic Container Service**
6. Then select **Elastic Container Service Task** and click **Next**
7. In the search box type `AmazonDynamoDBFullAccess`
8. Check the box next to it and click **Next**

> Note: For a real production app you would create a custom policy with only the permissions needed. For this workshop, full access is fine.

9. Role name: `BucketListECSTaskRole`
10. Click **Create role**

---

## Part 3 — Create an ECR Repository

ECR is where you store your Docker image on AWS.

1. In the search bar type **ECR** and click **Elastic Container Registry**
2. Click **Create repository**
3. Repository name: `bucketlist-app`
4. Leave everything else as default
5. Click **Create repository**
6. Click on the repository you just created
7. Copy the **URI** shown at the top — you will need it in the next step. It looks like:
   ```
   123456789.dkr.ecr.us-east-1.amazonaws.com/bucketlist-app
   ```

---

## Part 4 — Build and Push the Docker Image

Do this on your local machine in a terminal.

### 4.1 — Authenticate Docker with ECR

Replace `YOUR_ACCOUNT_ID` and `YOUR_REGION` with your values:

```bash
aws ecr get-login-password --region YOUR_REGION | docker login --username AWS --password-stdin YOUR_ACCOUNT_ID.dkr.ecr.YOUR_REGION.amazonaws.com
```

You should see: `Login Succeeded`

### 4.2 — Build the image

Navigate into the project folder:

```bash
cd bucketlist-app
docker build -t bucketlist-app .
```

This takes 2-3 minutes the first time.

### 4.3 — Tag the image

```bash
docker tag bucketlist-app:latest YOUR_ACCOUNT_ID.dkr.ecr.YOUR_REGION.amazonaws.com/bucketlist-app:latest
```

### 4.4 — Push the image

```bash
docker push YOUR_ACCOUNT_ID.dkr.ecr.YOUR_REGION.amazonaws.com/bucketlist-app:latest
```

Once done, go back to the ECR console, click your repository, and you should see the image listed there with the `latest` tag.

---

## Part 5 — Create an ECS Cluster

1. In the search bar type **ECS** and click **Elastic Container Service**
2. On the left click **Clusters**
3. Click **Create cluster**
4. Cluster name: `bucketlist-cluster`
5. Under **Infrastructure** make sure **AWS Fargate (serverless)** is selected
6. Click **Create**
7. Wait for the cluster to be created

---

## Part 6 — Create a Task Definition

A task definition tells ECS what container to run and how.

1. On the left sidebar click **Task definitions**
2. Click **Create new task definition**
3. Task definition family name: `bucketlist-task`
4. Under **Infrastructure requirements**:
   - Launch type: **AWS Fargate**
   - CPU: `0.5 vCPU`
   - Memory: `1 GB`
   - Task role: select `BucketListECSTaskRole` (the one we created in Part 2)
   - Task execution role: select `ecsTaskExecutionRole` (this should already exist, if not AWS will create it)
5. Scroll down to **Container details**:
   - Name: `bucketlist-app`
   - Image URI: paste your ECR image URI from Part 3, for example:
     ```
     123456789.dkr.ecr.us-east-1.amazonaws.com/bucketlist-app:latest
     ```
   - Container port: `3000`
   - Protocol: `TCP`
6. Scroll down to **Environment variables** and add these two:

   | Key | Value |
   |---|---|
   | `AWS_REGION` | `us-east-1` |
   | `DYNAMODB_TABLE` | `BucketListGoals` |

7. Click **Create**

---

## Part 7 — Create a Load Balancer

1. In the search bar type **EC2** and click it
2. On the left sidebar scroll down and click **Load Balancers**
3. Click **Create load balancer**
4. Select **Application Load Balancer** and click **Create**
5. Fill in:
   - Name: `bucketlist-alb`
   - Scheme: **Internet-facing**
   - IP address type: **IPv4**
6. Under **Network mapping**:
   - Select your default VPC
   - Select at least **2 availability zones** by checking the checkboxes
7. Under **Security groups**:
   - Click **Create new security group** (opens a new tab)
   - Name: `bucketlist-alb-sg`
   - Description: `Allow HTTP traffic`
   - Add an inbound rule:
     - Type: `HTTP`
     - Port: `80`
     - Source: `Anywhere-IPv4`
   - Click **Create security group**
   - Go back to the load balancer tab and select `bucketlist-alb-sg`
   - Remove the default security group if it was auto-selected
8. Under **Listeners and routing**:
   - Protocol: `HTTP`, Port: `80`
   - For Default action, click **Create target group** (opens a new tab):
     - Target type: **IP addresses**
     - Target group name: `bucketlist-tg`
     - Protocol: `HTTP`
     - Port: `3000`
     - VPC: select your default VPC
     - Health check path: `/`
     - Click **Next** then **Create target group**
   - Go back to the load balancer tab, click the refresh icon next to the target group dropdown and select `bucketlist-tg`
9. Click **Create load balancer**
10. Wait for the state to show **Active**
11. Copy the **DNS name** of the load balancer — this is your app's public URL

---

## Part 8 — Create an ECS Service

1. Go back to **ECS** → **Clusters** → click `bucketlist-cluster`
2. Click the **Services** tab
3. Click **Create**
4. Under **Environment**:
   - Compute options: **Launch type**
   - Launch type: **FARGATE**
   - Platform version: **LATEST**
5. Under **Deployment configuration**:
   - Application type: **Service**
   - Task definition Family: select `bucketlist-task`
   - Revision: select **LATEST**
   - Service name: `bucketlist-service`
   - Scheduling strategy: **Replica**
   - Desired tasks: `1`
   
6. Scroll down to **Networking**:
   - VPC: select your default VPC
   - Subnets: select all available subnets (check all of them)
   - Security groups: click **Create a new security group**
     - Security group name: `bucketlist-ecs-sg`
     - Description: `Allow traffic from ALB`
     - Inbound rule:
       - Type: `Custom TCP`
       - Port range: `3000`
       - Source: select `bucketlist-alb-sg` (the ALB security group you created in Part 7)
     - Click **Save**
   - Public IP: **Turned on** — this is important, the container needs it to pull the image from ECR
7. Scroll down to **Load balancing**:
   - Load balancer type: **Application Load Balancer**
   - Select **Use an existing load balancer**
   - Load balancer: select `bucketlist-alb`
   - Under **Listener**: select **Use an existing listener** → choose `80:HTTP`
   - Under **Target group**: select **Use an existing target group** → choose `bucketlist-tg`
   - Health check grace period: `30` seconds
8. Click **Create**
9. Wait for the deployment status to show **Succeeded** — this can take anywhere from **5 to 8 minutes**. Do not open the app URL until you see Succeeded. If you open it before the deployment completes you will get a 503 error because the container is not ready yet.
   - You can watch progress by clicking the **Deployments** tab inside the service — wait until it says **Succeeded**
   - You can also click the **Tasks** tab and watch the task go from `PROVISIONING → PENDING → RUNNING`

---

## Part 9 — Access Your Application

1. Go to **EC2** → **Load Balancers** → click `bucketlist-alb`
2. Copy the **DNS name** — it looks like:
   ```
   bucketlist-alb-123456789.us-east-1.elb.amazonaws.com
   ```
3. Open it in your browser:
   ```
   http://bucketlist-alb-123456789.us-east-1.elb.amazonaws.com
   ```
4. You should see the BucketList landing page
5. Click **Open App** to go to the dashboard
6. Add a goal and click **Create Goal**

---

## Part 10 — Verify Data in DynamoDB

Let's confirm the goal you just created was actually saved in DynamoDB.

1. Go to **DynamoDB** in the AWS Console
2. Click **Tables** on the left
3. Click on `BucketListGoals`
4. Click the **Explore table items** button (orange button on the right)
5. You should see your goal listed as an item with all its fields:
   - `goalId`
   - `title`
   - `description`
   - `category`
   - `priority`
   - `status`
   - `targetDate`
   - `createdAt`

If you see the item there, everything is working end to end.

---

## Troubleshooting

**Tasks keep stopping / not starting**
- Go to ECS → Clusters → bucketlist-cluster → Services → bucketlist-service → Logs tab
- Check the logs for error messages

**502 Bad Gateway from the Load Balancer**
- The container might still be starting up, wait 1-2 minutes and refresh
- Check that the target group health check is passing: EC2 → Target Groups → bucketlist-tg → Targets tab
- If targets show **unhealthy**, the container is not responding on port 3000 — check ECS task logs

**503 Service Temporarily Unavailable**
- This means the Load Balancer has no healthy targets to send traffic to
- Go to **EC2** → **Target Groups** → click `bucketlist-tg` → click the **Targets** tab
- If no targets are registered or all show **unhealthy**, the ECS service hasn't connected to the target group yet
- Fix checklist:
  1. Make sure the ECS service selected the correct target group (`bucketlist-tg`) during creation
  2. Make sure the ECS security group (`bucketlist-ecs-sg`) allows inbound TCP on port `3000` from `bucketlist-alb-sg`
  3. Make sure **Public IP is turned on** in the ECS service networking settings
  4. Go to ECS → your service → Tasks tab → click the running task → check the logs for errors
  5. Wait 2-3 minutes after the task starts — the health check needs a few passes before the target is marked healthy

**Cannot connect to DynamoDB**
- Make sure the Task Role `BucketListECSTaskRole` is set in the task definition
- Make sure the environment variables `AWS_REGION` and `DYNAMODB_TABLE` are set correctly

**Image not found**
- Make sure the ECR image URI in the task definition is correct and includes `:latest`
- Make sure Public IP is turned on in the ECS service networking settings

---

## Cleanup (to avoid AWS charges)

When you are done with the workshop, delete these resources:

1. ECS Service → set desired tasks to 0, then delete the service
2. ECS Cluster → delete `bucketlist-cluster`
3. Load Balancer → delete `bucketlist-alb`
4. Target Group → delete `bucketlist-tg`
5. ECR Repository → delete `bucketlist-app`
6. DynamoDB Table → delete `BucketListGoals`
7. IAM Role → delete `BucketListECSTaskRole`
