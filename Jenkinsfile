pipeline {
  agent any

  environment {
    NODE_HOME = tool name: 'NodeJS 20', type: 'NodeJS'
    PATH = "${env.NODE_HOME}/bin:${env.PATH}"
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install') {
      steps {
        dir('telecom-frontend') {
          sh 'npm ci'
        }
      }
    }

    stage('Lint & Test') {
      steps {
        dir('telecom-frontend') {
          sh 'npm test -- --watch=false --browsers=ChromeHeadless'
        }
      }
    }

    stage('Build') {
      steps {
        dir('telecom-frontend') {
          sh 'npm run build -- --configuration production'
        }
      }
    }

    stage('Docker Build') {
      steps {
        dir('telecom-frontend') {
          sh 'docker build -t telecom-frontend:latest .'
        }
      }
    }

    stage('Docker Push') {
      when {
        expression { env.DOCKER_REGISTRY?.trim() }
      }
      steps {
        withCredentials([usernamePassword(credentialsId: 'docker-hub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
          sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin $DOCKER_REGISTRY'
          sh 'docker tag telecom-frontend:latest $DOCKER_REGISTRY/telecom-frontend:latest'
          sh 'docker push $DOCKER_REGISTRY/telecom-frontend:latest'
        }
      }
    }
  }

  post {
    success {
      echo 'Build successful!'
    }

    failure {
      echo 'Build failed'
    }
  }
}
