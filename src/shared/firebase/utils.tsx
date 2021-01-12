import firebase from 'firebase';
import '@firebase/auth';

const config = {
    apiKey: "AIzaSyByOqQBOooSjgsW_UiaEQCfgbS5D66EdKY",
    authDomain: "engineeringthesis-888f7.firebaseapp.com",
    databaseURL: "https://engineeringthesis-888f7-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "engineeringthesis-888f7",
    storageBucket: "engineeringthesis-888f7.appspot.com",
    messagingSenderId: "185147312836",
    appId: "1:185147312836:web:81ae146c217cf39a1f9791"
};

firebase.initializeApp(config);

export const auth = firebase.auth();

const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });
export const signInWithGoogle = () => auth.signInWithPopup(provider);

export default firebase;