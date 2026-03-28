pipeline {
  agent any

  stages {

    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install') {
      steps {
        dir('telecom-frontend') {
          bat 'npm install'
        }
      }
    }

    stage('Test') {
      steps {
        dir('telecom-frontend') {
          bat 'npm test -- --watch=false --browsers=ChromeHeadless'
        }
      }
    }

    stage('Build') {
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

    stage('Docker Push') {
      steps {
        echo 'Skipping push (optional)'
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
