import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '../styles/Form.module.css'
import { HiAtSymbol, HiFingerPrint, HiOutlineX } from "react-icons/hi";
import { useFormik } from "formik";
import login_validate from 'lib/validate';
import { useEffect, useState } from 'react';
import Select from 'react-select';
import { db, storage } from 'firebaseConfig/firebase';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { addDoc, collection, doc, getDocs, query, serverTimestamp, setDoc, where } from 'firebase/firestore';
import { v4 as uuidv4, validate } from 'uuid';
import Layout from 'components/Layout';
import { toast } from 'react-toastify';
import { withProtected } from 'hooks/route';
import {  CirclesWithBar } from 'react-loader-spinner'



 function Menu() {
const[visible,setVisible] =useState(false)
  const colRef = collection(db, 'menu-data')
  const colRefTwo = collection(db, 'grade-data')
  const [file, setFile] = useState(null)
  const [tag, setTag] = useState('')
  const [progress, setProgress] = useState(0)
  const [uploadData, setUploadData] = useState({
    subject: '',
    grade: '',
   tag:[],
    title: '',
    description: '',
   
  })

const validateData=(obj)=>{

  const condition =[]
let checkCondition=true
  Object.entries(uploadData).forEach(([key,value])=>{
if(value.length===0){
  condition.push({key,value})
  checkCondition=false
}


  })

  return {checkCondition,condition:condition[0]}

}

  const uploadFiles = () => {

    console.log(file);
const {checkCondition,condition} =validateData(uploadData)
    if (file&&checkCondition) {
      if (!file) return

    const path = `/menu/${uploadData.grade}/${uploadData.subject}/${uuidv4()}`
    const storageRef = ref(storage, path)

    const uploadTask = uploadBytesResumable(storageRef, file)

    uploadTask.on('state_changed', (snapshot) => {

      const prog = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
      setProgress(prog)
    }, (err) => console.log(err), () => {
      getDownloadURL(uploadTask.snapshot.ref).then(
        url => {

         
          addPdfData(url, path)


        }
      )
    })
    } else {
      
     if (!checkCondition) {
      toast.error(`Fill ${condition.key} field`,{theme:'colored'})
     } else {
      toast.error(`choose a file`,{theme:'colored'})
     }
    }

  }


 


  const addPdfData = async (url, name) => {
    setVisible(true)
    await addDoc(colRef, { ...uploadData, menuLink: url, name,createdAt: serverTimestamp() }).then(() => {
      toast.success(`success`,{theme:'colored'})
    })

    setVisible(false)
  }
  

  const handleChange = (e) => {
if (e.target.name==='year') {
 
  setUploadData({ ...uploadData, [e.target.name]: Number(e.target.value) })
} else {
  setUploadData({ ...uploadData, [e.target.name]: e.target.value })
}
    
  }


  const handleTagChange =(e)=>{

    setTag(e.target.value) 

  }

const handleAdd =()=>{
if (tag.length>0) {
    setUploadData({...uploadData,tag:[...uploadData.tag,tag]})

    setTag('')
}


}
  
const removeItemHandler =(tag)=>{
 setUploadData(pre=>{
    return {...uploadData,tag:uploadData.tag.filter(item=>item!=tag)}
 })
}



  return (
    <Layout title='Grade5 - Home'>
      
      <section className="w-3/4 mx-auto pb-80">

        <div className="title mb-5">
          <h1 className="text-white-800 text-4xl font-bold mt-8 text-center">
            ADD MENU ITEM 
          </h1>

        </div>
      
        <div className="flex flex-col gap-5" >
          <div className={styles.input_group}>
            <input type="text" name="grade" placeholder="Grade" className={styles.input_text} onChange={handleChange} value={uploadData.grade} />

          </div>



          <div className={styles.input_group}>
            <div className='flex p-2'><button onClick={handleAdd} className='ml-5 mr-16 bg-red-600 p-5 rounded'>ADD</button> <input type="text" name="tag" placeholder="Add tag" className={styles.input_text} onChange={handleTagChange} value={tag} /></div>
           

          </div>


          <div className={styles.input_group}>
          {uploadData.tag.length>0 && uploadData.tag.map((d,i)=>{
            return (<button key={i} className='m-5 p-5  bg-lime-500 rounded ' onClick={() => removeItemHandler(d)} >{d}<HiOutlineX className="h-5 w-5" color='red' ></HiOutlineX></button>)
          })}

          </div>




          <div className={styles.input_group}>
            <input type="text" name="subject" placeholder="Subject" className={styles.input_text} onChange={handleChange} value={uploadData.subject} />

          </div>
         
          <div className={styles.input_group}>
            <input type="text" name="description" placeholder="Description" className={styles.input_text} onChange={handleChange} value={uploadData.description} />

          </div>

          <div className={styles.input_group}>
            <input type="text" name="title" placeholder="Title" className={styles.input_text} onChange={handleChange} value={uploadData.title} />

          </div>

          <div className={styles.input_group}>
            <input type="file" name="pdf" placeholder="select file" className={styles.input_text} onChange={(e) => setFile(e.target.files[0])} />

          </div>
         
          <CirclesWithBar
  height="100"
  width="100"
  color="#4fa94d"
  wrapperStyle={{}}
  wrapperClass=""
  visible={visible}
  outerCircleColor=""
  innerCircleColor=""
  barColor=""
  ariaLabel='circles-with-bar-loading'
/>
          <div className={styles.button}>
            <button onClick={uploadFiles} className='text-center'>
              UPLOAD
            </button>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default withProtected(Menu)
