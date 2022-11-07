import {getAuth,onAuthStateChanged,signInWithEmailAndPassword,createUserWithEmailAndPassword } from "firebase/auth"
import {Link, useNavigate} from "react-router-dom"
import {useState,useEffect, } from "react"
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import Home from "./home"
import { collection, addDoc,getDoc, doc, onSnapshot,query,serverTimestamp
    , orderBy, limit, deleteDoc,updateDoc,getDocs,where
  } 
from "firebase/firestore"; 
import "./login.css"


const firebaseConfig = {
    apiKey: "AIzaSyDrxf1iRv6g8rdUERYv19tDxptmW9tqnTg",
    authDomain: "chat-app-with-database-fae34.firebaseapp.com",
    projectId: "chat-app-with-database-fae34",
    storageBucket: "chat-app-with-database-fae34.appspot.com",
    messagingSenderId: "738066714092",
    appId: "1:738066714092:web:d8f9b45960905706cc84c9",
    measurementId: "G-FSTEW5S5SV"
  
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);


  const auth = getAuth(app);


let usersInfo = []











function Login() {

    const [loginMail, setLoginMail] = useState("")
    const [loginPass, setLoginPass] = useState("")
    let navigate = useNavigate();
    const [usersData, setUsersData] = useState([])


    useEffect(() =>{
        const getData = async () => {
        
            let userId = []
        
            const q = query(collection(db, "userInfo"),);
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id);
            usersInfo.push( {id:doc.id,...doc.data()})
            console.log(usersInfo.id)
            });
        
            setUsersData(usersInfo)
            console.log(usersData)
    
          
        }
    
        
        getData()
    
     
    
    },[])







    
const loginUser = async (e) =>{
    e.preventDefault()
    try {
        const user = await signInWithEmailAndPassword(auth,loginMail, loginPass)
        console.log(user)
        const docRef = doc(db, "userInfo","checkAuth");

        const data = {
            boolean: true
        };
        updateDoc(docRef, data)
    }
    catch (error) {
        console.log(error.message)

    }
    const docRef = doc(db, "userInfo","checkAuth");
    const docSnap = await getDoc(docRef);


    if(docSnap.data().boolean == true){
        let path = `newPath`; 
        navigate("/")
        window.location.reload();
        alert("Welcome ")
        
     }
}

    return (
        <div className="main-div">
            <div className="sub-div">
                <h1 className="main-head">Login To Continue</h1>
                <form >

                    <input type="email" placeholder="Enter Your Email" onChange={(e) =>{
                        setLoginMail(e.target.value)
                        
                    }}

                    />
                    <input type="password" placeholder="Enter your password" onChange={(e) =>{
                        setLoginPass(e.target.value)
                        
                    }}
                    />
                    <br />

                    <button type="submit" onClick={loginUser}>Log In</button>
                </form>
                <a href="/signup" className="regiter">Didn't have an account?Register Yourself</a>
            </div>
            


        </div>
    )
}
export default Login