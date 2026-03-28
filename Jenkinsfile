pipeline {
  agent any

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
        dir('telecom-frontend') {
          bat 'docker build -t telecom-frontend:latest .'
        }
      }
    }

    stage('Docker Tag') {
      steps {
        bat 'docker tag telecom-frontend:latest yourdockerhubusername/telecom-frontend:latest'
      }
    }

    stage('Docker Push') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'docker-hub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
          bat 'echo %DOCKER_PASS% | docker login -u %DOCKER_USER% --password-stdin'
          bat 'docker push yourdockerhubusername/telecom-frontend:latest'
        }
      }
    }

    stage('Kubernetes Deploy') {
      steps {
        bat 'kubectl apply -f k8s/deployment.yaml'
        bat 'kubectl apply -f k8s/service.yaml'
      }
    }
  }

  post {
    success {
      echo '✅ CI/CD Pipeline Successful!'
    }
    failure {
      echo '❌ Pipeline Failed'
    }
  }
}
