# Recipe Generator with Terraform and React
![architecture.png](images%2Farchitecture.png)

Welcome to the Recipe Generator project! This project showcases a modern cloud-based web application that allows users to generate and view recipes. It's a React-based frontend application, which communicates with a serverless backend on AWS. The infrastructure on AWS is provisioned and managed using Terraform, an Infrastructure as Code (IaC) tool, which ensures that the infrastructure is reproducible and maintainable.

Users of the Recipe Generator can register and login through a secure authentication system. They can then input ingredients they have at hand, and the application will generate a recipe based on those ingredients. Users can also view their previously generated recipes.

This project demonstrates the effective use of cloud services and serverless architecture to build scalable and high-performing web applications. It's ideal for developers who are looking to get hands-on experience with AWS services, Terraform, and React.

## AWS Services Used
This project includes a Recipe Generator React web application that uses the following AWS services provisioned via Terraform:

* **Amazon API Gateway**: Used for creating, publishing, maintaining, monitoring, and securing APIs.
* **Amazon CloudFront**: A global Content Delivery Network (CDN) service that securely delivers data to customers with low latency and high transfer speeds.
* **Amazon Cognito**: Provides authentication, authorization, and user management for web and mobile apps.
* **Amazon DynamoDB**: A managed NoSQL database service for all applications that need consistent, single-digit millisecond latency at any scale.
* **AWS Lambda**: Lets you run code without provisioning or managing servers.
* **Amazon S3**: An object storage service that offers industry-leading scalability, data availability, security, and performance.
* **Amazon Route 53**: A highly available and scalable cloud Domain Name System (DNS) web service.

## Directory Structure

```plaintext
.
├── README.md
└── terraform                     # Terraform configurations and related files
    ├── api_gw.tf                 # API Gateway configuration
    ├── backend.tf                # Backend configuration
    ├── cloudfront.tf             # CloudFront distribution configuration
    ├── cognito.tf                # Amazon Cognito User Pool configuration
    ├── data.tf                   # Data sources configuration
    ├── dynamo.tf                 # DynamoDB table configuration
    ├── files                     # Directory containing frontend files
    │   ├── App.css               # Main CSS for React App
    │   ├── App.js                # React App entry point
    │   ├── favicon.png           # Favicon for the web app
    │   └── index.js              # Index file for React App
    ├── lambda_backend.tf         # Lambda function configuration
    ├── locals.tf                 # Local variables for Terraform
    ├── plan.out                  # Terraform plan output
    ├── r53.tf                    # Route 53 configuration
    ├── recipe_generator          # Recipe generation scripts and dependencies
    │   ├── recipe_generator.py   # Python script for recipe generation
    │   ├── recipe_generator.zip  # Zipped file for AWS Lambda deployment
    │   └── requirements.txt      # Python dependencies
    ├── s3.tf                     # S3 bucket configuration
    ├── secrets.tf                # Secrets management
    ├── variables.tf              # Input variables for Terraform
    └── versions.tf               # Terraform and provider versions
```

## Application Overview
The React web application allows users to generate recipes based on ingredients they have. Users need to sign in or sign up to use the application. The app integrates with Amazon Cognito for user authentication. It also allows users to fetch previous recipes.

## Prerequisites
* Node.js (for React App development)
* Terraform 1.5+
* AWS CLI configured with appropriate AWS access credentials
* Python (for Lambda function)

## Create react.js application
1. Navigate to the files directory and install the React app dependencies:
    ```bash
    cd files
    npx create-react-app recipe-generator
    cp App.* recipe-generator/src
    cp index.js recipe-generator/src
    cp favicon.png recipe-generator/public
    cd recipe-generator
    npm install aws-sdk
    npm install amazon-cognito-identity-js
    npm install axios
    ```
2. Compile the react.js application
    ```bash
    npm run build
    ```

## Deployment
1. Navigate to the terraform directory:
    ```bash
    cd terraform
    ```
2. Initialize Terraform:
    ```bash
    terraform init
    ```
3. Run a Terraform plan to see what changes will be applied:
    ```bash
    terraform plan -out=plan.out
    ```
4. Apply the changes:
    ```bash
    terraform apply plan.out
    ```

## Usage
* Upon opening the web app, users can sign up or log in.
![landing_page.png](images%2Flanding_page.png)
* Once logged in, users can enter ingredients (comma-separated), select the language and units, and then click on "Generate Recipe".
![recipe_generator.png](images%2Frecipe_generator.png)
* Users can also fetch their past recipes by clicking on "Get Past Recipes".
![recipe.png](images%2Frecipe.png)

## Author
Todd Bernson