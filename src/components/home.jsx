import './home.css';
import {useState, useEffect} from "react"
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { collection, addDoc,getDocs,doc, onSnapshot,query,serverTimestamp
        , orderBy, limit, deleteDoc,updateDoc,getDoc
      } 
 from "firebase/firestore"; 
import moment from "moment"
import { useFormik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import avatar from "./avatar.png"
import {Routes, Route, Link,useNavigate} from "react-router-dom"
import Login from "./login"
import Signup from "./signup"
import {getAuth,  createUserWithEmailAndPassword,onAuthStateChanged, signOut } from "firebase/auth"
import logout from "../assest/logout.png"
import deletee from "../assest/delete.png"
import edit from "../assest/edit.png"



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





function Home() {
  const [aboutPost, setAboutPost] = useState("");
  const [posts, setPosts] = useState([]);
  const[file,setFile] = useState(null)

  const [editing, setEditing] = useState({
    editingId : null,
    editingTxt: ""
  }) 

  let navigate = useNavigate();




  const logOut =async () =>{
    // try{
      await signOut(auth)
      const docRef = doc(db, "userInfo","checkAuth");
      const docSnap = await getDoc(docRef);


      const data = {
          boolean: false
      };
      updateDoc(docRef, data)


    // }

    // catch(error){
    //   console.log(error.message)

    // }
    
    // const docRef = doc(db, "userInfo","checkAuth");
    // const docSnap = await getDoc(docRef);
  
    
    if (docSnap.data().boolean == false) {
      
      let path = `newPath`; 
      navigate("/login")
      window.location.reload();
      alert("You are logged out ")

      
  
    }




  }


  const formik = useFormik({
    initialValues: {
      title: "",
      text: "",
    },
    validationSchema: yup.object({
      

      text: yup
        .string('Please enter your post text')
        .required('Post text is required')
        .min(10, "Please enter at least 10 characters in post")
        .max(300, '300 Characters Allowed'),

    }),
    onSubmit : async (values) =>{


      const cloudinaryData = new FormData();
    cloudinaryData.append("file", file);
    cloudinaryData.append("upload_preset", "postImages");
    cloudinaryData.append("cloud_name","dqiraxirr");
    console.log(cloudinaryData);
    axios.post(`https://api.cloudinary.com/v1_1/dqiraxirr/image/upload/`,
    cloudinaryData,

     {
      headers:{"Content-Type" : "multipart/form-data"}
    })
        .then( async res => {
            
            console.log("from then", res.data);
            console.log("Value", values)
            try {
              const docRef = await addDoc(collection(db, "userPosts"), {
                title:values.title,
                text: values.text,
                img : res?.data?.url,
                date: serverTimestamp()

              });
              console.log("Document written with ID: ", docRef.id);
            } catch (e) {
              console.error("Error adding document: ", e);
            }
        })
        .catch(err => {
            console.log("from catch", err);
        })
   
    },
  });





  
useEffect(() =>{

  const getData = async () => {
    const querySnapshot = await getDocs(collection(db, "userPosts"));
    querySnapshot.forEach((doc) => {
    console.log(`${doc.id} => `,doc.data());
    setPosts((prev) =>{
      let newArray = [...prev,doc.data()  ]
      return(newArray)

    })
  });

  }
  // getData();
  let unsubscribe = null
  const realTimeData = async () =>{
    const q = query(collection(db, "userPosts"), orderBy("date", "desc"));
    unsubscribe = onSnapshot(q, (querySnapshot) => {
    const posts = [];
    querySnapshot.forEach((doc) => {
      
      posts.push({id:doc.id, ...doc.data()});
  });

  // if (posts.length !== 0 ) {
      console.log("Post", posts); 
      setPosts(posts)


    
  // }
  });
   
  }
  realTimeData();

  return () =>{
    console.log("Clean up")
    unsubscribe();
  }

},[])

  
  const getPosts = async (e) =>{
    e.preventDefault()
    console.log(aboutPost)
   
    

  }

  const deletePost = async (postId) => {
    await deleteDoc(doc(db, "userPosts", postId))

  }


  const updatedPost = async (e) =>{
    e.preventDefault();

    await updateDoc(doc(db, "userPosts", editing.editingId), {
      text: editing.editingTxt
    });

    setEditing({
      editingId: null,
      editingTxt: ""
    })
    


  }

  

  




  return (
    <div className='parent-div'>
      <div className='navbar'>
        <div className='logo'>
          <h2>Post App</h2>


        </div>
        <div className='logout'>
          <img src={logout} alt="logout" height="35" width="35" title='logout' onClick={logOut}/>

        </div>
      </div>
      <div className='child-div'>

      <div className='post-input'>
        <form onSubmit={formik.handleSubmit}>
      
          <textarea type="text" name = "text" value={formik.values.text} onChange={formik.handleChange}
          placeholder = "What's in your mind...?"
           
          />
          <span>
              {formik.touched.text && formik.errors.text}
          </span>
          <br />

          <input type="file" name='profilePic' onChange={(e) => {
            console.log(e.target.files[0])
            setFile(e.target.files[0])

          }}/>
          <br />

          <button type='submit'>Post</button>
        </form>

      </div>

      <div className='display-post'>
      
        {
          posts.map((eachPost,i) => (

            <div className='postText' key={i}>
              <div className='about-post'>
                <div className='avatar'>
                      <img src={avatar} alt="" height="50" width="50"/>
                    

                </div>

                <div className='info'>
                  <p>User Name</p> 
                        <p className='date'> {moment((eachPost?.date?.seconds)? eachPost.date.seconds*1000 : undefined)
                  .format('MMM Do YY,h:mm a')}</p>


                </div>

                  
                <div className='btns'>
                  <img src={deletee} title = "delete post" height="40" width="40" onClick={() =>{
                    deletePost(eachPost?.id)
                  }}/>

                  {(editing.editingId === eachPost?.id)?null : <img src={edit} title = "edit text" height="40" width="40" onClick={() => {
                    setEditing({
                      editingId:eachPost?.id,
                      editingTxt:eachPost?.text
                
                    })
                  }}
                  
                  />}
                </div>



              </div>
                
          
              <p className = "text">{(eachPost.id === editing.editingId)?
              <form onSubmit={updatedPost} className = "update">
                 <input type="text" value={editing.editingTxt} 
                 onChange = {(e) =>{
                  setEditing({...editing, editingTxt: e.target.value})

                 }}/>
                <button type='submit'>Update</button>

              </form>
                :eachPost?.text}</p>
              

              <div className='post-img'>
                 <img src= {eachPost?.img} alt="" height="400" width="450" />


              </div>






            </div>
          ))}

      </div>
      </div>

    </div>
    
    
  );
}

export default Home;
