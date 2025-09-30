#!/bin/bash

# SmartMed n8n Deployment Script

echo "🚀 Deploying SmartMed n8n to Google Cloud Run..."

# Check if gcloud CLI is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ Google Cloud CLI is not installed"
    echo "Please install gcloud CLI: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Check if we're logged in to gcloud
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | head -n 1 &> /dev/null; then
    echo "❌ Not logged in to Google Cloud"
    echo "Please run: gcloud auth login"
    exit 1
fi

# Set project ID
PROJECT_ID=${1:-smartmed-dev}
echo "📋 Using project: $PROJECT_ID"

# Set project
gcloud config set project $PROJECT_ID

# Enable required APIs
echo "🔧 Enabling required Google Cloud APIs..."
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
gcloud services enable vision.googleapis.com
gcloud services enable aiplatform.googleapis.com

# Create service account for n8n
SERVICE_ACCOUNT_NAME="smartmed-n8n"
SERVICE_ACCOUNT_EMAIL="$SERVICE_ACCOUNT_NAME@$PROJECT_ID.iam.gserviceaccount.com"

echo "👤 Creating service account: $SERVICE_ACCOUNT_EMAIL"
gcloud iam service-accounts create $SERVICE_ACCOUNT_NAME \
    --display-name="SmartMed n8n Service Account" \
    --description="Service account for SmartMed n8n workflows"

# Grant necessary permissions
echo "🔐 Granting permissions to service account..."
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$SERVICE_ACCOUNT_EMAIL" \
    --role="roles/cloudtranslate.user"

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$SERVICE_ACCOUNT_EMAIL" \
    --role="roles/aiplatform.user"

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$SERVICE_ACCOUNT_EMAIL" \
    --role="roles/storage.admin"

# Build and deploy n8n container
echo "🏗️ Building n8n container image..."
gcloud builds submit --tag gcr.io/$PROJECT_ID/smartmed-n8n

# Deploy to Cloud Run
echo "🚀 Deploying to Cloud Run..."
gcloud run deploy smartmed-n8n \
    --image gcr.io/$PROJECT_ID/smartmed-n8n \
    --platform managed \
    --region us-central1 \
    --service-account $SERVICE_ACCOUNT_EMAIL \
    --allow-unauthenticated \
    --set-env-vars="N8N_HOST=0.0.0.0,N8N_PORT=5678,N8N_PROTOCOL=https" \
    --max-instances 3 \
    --memory 2Gi \
    --cpu 1 \
    --timeout 300

# Get service URL
SERVICE_URL=$(gcloud run services describe smartmed-n8n --platform managed --region us-central1 --format="value(status.url)")

echo "✅ n8n deployed successfully!"
echo "🌐 Service URL: $SERVICE_URL"
echo "📖 Admin Panel: $SERVICE_URL"
echo "🔗 Webhook URL: $SERVICE_URL/webhook/"

# Create secrets for sensitive data
echo "🔑 Setting up secrets..."
echo "Please manually create the following secrets in Google Secret Manager:"
echo "- n8n-secrets/webhook-url: $SERVICE_URL/webhook/"
echo "- n8n-secrets/encryption-key: (generate a random 32-character string)"
echo "- n8n-secrets/db-host: (your database host)"
echo "- n8n-secrets/db-name: (your database name)"
echo "- n8n-secrets/db-user: (your database user)"
echo "- n8n-secrets/db-password: (your database password)"

echo ""
echo "📋 Next steps:"
echo "1. Create the secrets in Google Secret Manager"
echo "2. Update the Cloud Run service with the secret environment variables"
echo "3. Import the workflow JSON files into n8n admin panel"
echo "4. Test the workflows with sample data"
