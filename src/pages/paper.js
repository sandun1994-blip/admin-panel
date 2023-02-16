import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '../styles/Form.module.css'
import { HiAtSymbol, HiFingerPrint } from "react-icons/hi";
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
import { CirclesWithBar } from 'react-loader-spinner';




 function Paper() {

  const[visible,setVisible] =useState(false)

  const colRef = collection(db, 'pdf-data')
  const colRefTwo = collection(db, 'grade-data')
  const [file, setFile] = useState(null)
  const [progress, setProgress] = useState(0)
  const [uploadData, setUploadData] = useState({
    subject: '',
    year: 2023,
    grade: '',
    semester: 'main',
    title: '',
    description: '',
    school :'none'
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
const {checkCondition,condition} =validateData(uploadData)
    if (file&&checkCondition) {
      if (!file) return

    const path = `/pdf/${uploadData.grade}/${uploadData.subject}/${uploadData.semester}/${uuidv4()}`
    const storageRef = ref(storage, path)

    const uploadTask = uploadBytesResumable(storageRef, file)

    uploadTask.on('state_changed', (snapshot) => {

      const prog = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
      setProgress(prog)
    }, (err) => console.log(err), () => {
      getDownloadURL(uploadTask.snapshot.ref).then(
        url => {

          addGradeData()
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
    await addDoc(colRef, { ...uploadData, pdfLink: url, name,createdAt: serverTimestamp() }).then(() => {
      toast.success(`success`,{theme:'colored'})
    })
    setVisible(false)
  }
  const addGradeData = async () => {
    setVisible(true)
    const dataObj = { subject: '', year: [], grade: '' }
    const exitData = await getaDataByGradeAndSubject(uploadData.grade, uploadData.subject)

    if (exitData.length > 0) {

      const checkYear = exitData[0]?.year.includes(uploadData.year) ? exitData[0]?.year.includes(uploadData.year) : false
      if (!checkYear) {
        await setDoc(doc(db, "grade-data", exitData[0].id), {
          ...exitData[0], year: [...exitData[0]?.year, uploadData.year]
        });

      }

    } else {

      await addDoc(colRefTwo, { ...dataObj, subject: uploadData.subject, year: [uploadData.year], grade: uploadData.grade,createdAt: serverTimestamp() }).then(() => {
        
      })
    }



    setVisible(false)


  }



  const handleChange = (e) => {
if (e.target.name==='year') {
  console.log('ok');
  setUploadData({ ...uploadData, [e.target.name]: Number(e.target.value) })
} else {
  setUploadData({ ...uploadData, [e.target.name]: e.target.value })
}
    
  }


  const getaDataByGradeAndSubject = async (grade, subject) => {
    
    const data = []
    try {
      // const q = query(colRefTwo, where("year", 'array-contains-any', [year]), where("grade", "==", grade), where("subject", "==", subject))
      const q = query(colRefTwo, where("grade", "==", grade), where("subject", "==", subject))
      //const b = query(colRefTwo, where("grade", "==", '5'));   //where('brand', 'in', ['nike', 'adidas'])
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        data.push({ ...doc.data(), id: doc.id })
        console.log(doc.id, " => ", doc.data());
      });

      return data
    } catch (error) {
      console.log(error);
    }

   
  }


  // useEffect(()=>{
  //   getaDataByGradeAndSubject()
  // },[])

  return (
    <Layout title='Grade5 - Home'>
      
      <section className="w-2/4 mx-auto">

        <div className="title mb-16">
          <h1 className="text-white-800 text-4xl font-bold py-6 text-center">
            PDF UPLOAD
          </h1>

        </div>

        <div className="flex flex-col gap-5" >
          <div className={styles.input_group}>
            <input type="text" name="grade" placeholder="Grade" className={styles.input_text} onChange={handleChange} value={uploadData.grade} />

          </div>

          <div className={styles.input_group}>
            <input type="number" name="year" placeholder="Year" className={styles.input_text} onChange={handleChange} value={Number(uploadData.year)} />

          </div>
          <div className={styles.input_group}>
            <select
              className={styles.input_text}
              value={uploadData.semester}
              onChange={
                handleChange
              }
              name='semester'

            >
              {['main', 'semester 1', 'semester 2', 'semester 3'].map((x) => (
                <option key={x} value={x}>
                  {x}
                </option>
              ))}
            </select>

           
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
          <div className={styles.input_group}>
            <input type="text" name="school" placeholder="school or university" className={styles.input_text} onChange={handleChange} value={uploadData.school} />

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



export default withProtected(Paper) 