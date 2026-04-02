pipeline {
    agent any

    environment {
        DOCKER_HUB = "rakeshdocker7"
        IMAGE_NAME = "telecom-frontend"
        KUBECONFIG = "C:\\Users\\Welcome\\.kube\\config"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                dir('telecom-frontend') {
                    bat 'npm install'
                }
            }
        }

        stage('Build Application') {
            steps {
                dir('telecom-frontend') {
                    bat 'npm run build -- --configuration production'
                }
            }
        }

        stage('Docker Build') {
            steps {
                bat 'docker build -t %IMAGE_NAME%:latest .'
            }
        }

        stage('Docker Tag') {
            steps {
                bat 'docker tag %IMAGE_NAME%:latest %DOCKER_HUB%/%IMAGE_NAME%:latest'
            }
        }

        stage('Docker Login & Push') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'docker-hub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    bat '''
                    echo %DOCKER_PASS% | docker login -u %DOCKER_USER% --password-stdin
                    docker push %DOCKER_HUB%/%IMAGE_NAME%:latest
                    '''
                }
            }
        }

        stage('Check Kubernetes Connection') {
            steps {
                bat '''
                echo Using KUBECONFIG: %KUBECONFIG%
                kubectl config current-context
                kubectl get nodes
                '''
            }
        }

        stage('Kubernetes Deploy') {
            steps {
                bat '''
                kubectl apply -f k8s/deployment.yaml
                kubectl apply -f k8s/service.yaml
                '''
            }
        }
    }

    post {
        success {
            echo '✅ CI/CD Pipeline Successful 🚀'
        }
        failure {
            echo '❌ Pipeline Failed'
        }
    }
}
