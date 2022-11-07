import { async } from "@firebase/util"
import {useState,useEffect, } from "react"
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { collection, addDoc,
         
      } 
 from "firebase/firestore"; 
 import {getAuth,createUserWithEmailAndPassword,onAuthStateChanged } from "firebase/auth"
 import {Link, useNavigate} from "react-router-dom"
 import Login from "./login"
 import "./signup.css"



 

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
  
  
  // Initialize Cloud Firestore and get a reference to the service
  const db = getFirestore(app);
  const auth = getAuth(app);

  




function Signup() {
    const [userName, setUserName] = useState("")
    const [userPass, setUserPass] = useState("")
    const [userMail, setUserMail] = useState("")
    const [user, setUser] = useState({})
    let navigate = useNavigate();

    useEffect (()=>{
        
        onAuthStateChanged(auth, (user) =>{
            if (user) {
                setUser(user)
                console.log(user.email)
              } 
    
        })

        

    },[])

    const register = async (e) =>{
        console.log(userMail)
        e.preventDefault()
        try {
            const user = await createUserWithEmailAndPassword(auth,userMail, userPass)
            console.log(user)
            const docRef = await addDoc(collection(db, "userInfo"), {
                userName: userName,
                userMail: userMail,
                userPass: userPass,
                id : auth.currentUser.uid
               
  
              });
              console.log("Document written with ID: ", docRef.id);
              let path = `newPath`; 
            navigate("/login")
            alert("Congratulation Your'e now our user")
        }

        catch (error) {
            console.log(error.message)

        }

        

        

    }



    return (
        <div className="main-div">
            <div className="sub-div">
            <h1 className="main-head">Register Yourself</h1>

            <form>
                <input type="text" placeholder="Enter Your Full Name"
                onChange={(e) =>{
                    setUserName(e.target.value)
                }}
                />
                 <br />

                <input type="email" placeholder="Enter Your Email"
                onChange={(e) =>{
                    setUserMail(e.target.value)
                }}
                /> <br />

                <input type="password" placeholder="Enter Your Passcode"
                onChange={(e) =>{
                    setUserPass(e.target.value)
                }}
                /> <br />

                    <button type="submit" onClick={register}>
                        Register  
                    </button>
            </form>
            <Link to="/" className="regiter">Already have an account?Login.</Link>

            </div>
        </div>

    )
}
export default Signup