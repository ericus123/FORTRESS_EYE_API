pipeline {
  agent any
    
  tools {nodejs "node"}
    
  stages {
        
    stage('Git') {
      steps {
        git 'https://github.com/ericus123/FORTRESS_EYE'
      }
    }
     
    stage('Build') {
      steps {
        sh 'yarn install'
         sh 'yarn build'
      }
    }  
    
            
    // stage('Test') {
    //   steps {
    //     sh 'node test'
    //   }
    // }
  }
}