#########################
# Deploy to Google Cloud Run
#########################

The Cloud Run deployment will forward to port 9000 which is an nginx server in the same docker as the Angular PWA.
A node process will start on port 8080, 8081 and more. To check which processes start, read the app.pm2.json file which
contains the PM2 configs for runtime start. 

The docker to be built is Docker-GCP that installs and configures nginx, creates the cache folder and copies 
the configs. The entrypoint.sh in this folder will run everytime the docker starts to ensure the nginx and pm2
start as they should.

## Deploy to cloud run

1. Go to [Cloud run](https://console.cloud.google.com/run/)
2. Click Create service
3. Select "Continuously deploy new revisions from a source repository"
   Select Github and connect project
   Select Dockerfile Build and write "Dockerfile-GCP"
4. Set Options
5. Add Environment Variables
6. Deploy


### Deployment options
Autoscaling minimum: 2
Autoscaling maximum: 10
Ingress: allow all traffic
Authentication: Allow unauthenticated invocations
Port: 9000
CPU allocation and pricing: CPU is always allocated (otherwise pm2 will have abnormal behaviour)
Container Command: /bin/bash
Container Arguments: /var/nao/deploy/GCP/entrypoint.sh
Memory: 2Gb
CPU: 2
Request Timeout: 300
Maximum Requests per container: 80
Execution environment: Second generation

_if it's the first deploy, you might have to merge main to latest to trigger the first build. Until then, the docker will be flagged as failed to deploy_

## Deploy Load balancer
From Internet to my VMs or serverless services
Global HTTP(S) Load Balancer

Frontend:
Protocol: HTTP
Ip Version: IPv4
IP address: Create new
Port: 80

Backend:
Create Backend service
Backend type: Serverless network endpoint group

Create endpoint group:
Cloud run
Select service

Enable CDN
Use origin settings based on Cache-Control headers

## Cloudflare DNS
Create an A record with value @ and IP of the load balancer with Proxy enabled
Create an AAAA record with the value www and the IP 100:: with Proxy enabled

## Experiment:
1. Try setting the cache headers directly in the GCP cache. It decreases the response time
2. Is there a way to ban people from using the IP direct?

###########################
# Deploy to GCP K8s
###########################

Follow the docs:
https://docs.github.com/en/actions/deployment/deploying-to-your-cloud-provider/deploying-to-google-kubernetes-engine
