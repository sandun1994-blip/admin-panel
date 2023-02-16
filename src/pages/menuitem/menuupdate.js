import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '../../styles/Form.module.css'
import { HiAtSymbol, HiFingerPrint,HiOutlineX } from "react-icons/hi";
import { useFormik } from "formik";
import login_validate from 'lib/validate';
import { useEffect, useState } from 'react';
import Select from 'react-select';
import { db, storage } from 'firebaseConfig/firebase';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { addDoc, collection, deleteDoc, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { v4 as uuidv4, validate } from 'uuid';
import Layout from 'components/Layout';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { withProtected } from 'hooks/route';




 function UpdateMenu() {

    const router =useRouter()
    const colRef = collection(db, 'menu-data')
    const colRefTwo = collection(db, 'grade-data')
    const [progress, setProgress] = useState(0)
    const [tableData, setTableData] = useState([])
    const [tag, setTag] = useState('')
   
    const [uploadData, setUploadData] = useState({
      year: 2023,
      grade: '',
     tag:[],
      title: '',
      description: '',
     
    })

    const [searchData, setSearchData] = useState({
        grade: '',
        subject: '',
       

    })
    const validateData = (obj) => {

        const condition = []
        let checkCondition = true
        Object.entries(uploadData).forEach(([key, value]) => {
            if (value.length === 0) {
                condition.push({ key, value })
                checkCondition = false
            }


        })

        return { checkCondition, condition: condition[0] }

    }

    const validateSearchData = (obj) => {

        const condition = []
        let checkCondition = true
        Object.entries(searchData).forEach(([key, value]) => {
            if (value.length === 0) {
                condition.push({ key, value })
                checkCondition = false
            }


        })

        return { checkCondition, condition: condition[0] }

    }
    const uploadFiles = () => {
        const { checkCondition, condition } = validateData(uploadData)
        if (file && checkCondition) {
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
                toast.error(`Fill ${condition.key} field`, { theme: 'colored' })
            } else {
                toast.error(`choose a file`, { theme: 'colored' })
            }
        }

    }





    const addPdfData = async (url, name) => {
        await addDoc(colRef, { ...uploadData, pdfLink: url, name }).then(() => {
            toast.success(`success`, { theme: 'colored' })
        })
    }
    const addGradeData = async () => {
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

            await addDoc(colRefTwo, { ...dataObj, subject: uploadData.subject, year: [uploadData.year], grade: uploadData.grade }).then(() => {
                console.log('sucess two');
            })
        }






    }



   

    const handleChangeSearch = (e) => {

        setSearchData({ ...searchData, [e.target.name]: e.target.value })
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


    const getaEditData = async (param) => {
       
        const data = []
        try {
            // const q = query(colRefTwo, where("year", 'array-contains-any', [year]), where("grade", "==", grade), where("subject", "==", subject))
            const q = query(colRef, where("subject", "==", param.subject),  where("grade", "==", param.grade))
            //const b = query(colRefTwo, where("grade", "==", '5'));   //where('brand', 'in', ['nike', 'adidas'])
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                data.push({ ...doc.data(), id: doc.id })
                console.log(doc.id, " => ", doc.data());
            });
            console.log(data);
            setTableData(data)
        } catch (error) {
            console.log(error);
        }


    }

    const handleSearch = () => {

        const { checkCondition, condition } = validateSearchData(searchData)
        if (checkCondition) {
            getaEditData(searchData)
        } else {

            toast.error(`Fill ${condition.key} field`, { theme: 'colored' })

        }

    }

    const removeItemHandler = async(item) => {

        await deleteDoc(doc(colRef, item.id)).then(res=>{

            setTableData(pre=>{
                return pre.filter(e=>e.id !=item.id)
            })

        }).catch(err=>{
            console.log(err);
        })
    }


    const handlerowClick=(id)=>{

        router.push(`/menuitem/${id}`)

    }
    // useEffect(()=>{
    //     console.log(tableData);
    // },[tableData])

    return (
        <Layout title='Grade5 - Home'>

            <div className=' justify-between w-screen'>


                <div className="flex justify-around">

                    <div
                        className={`flex mt-8 justify-between `}
                    >
                       

                        < div className="text-xl md:my-0 mx-2 ">
                            <div className={styles.input_group}>
                                <input type="text" name="grade" placeholder="Grade" className={styles.input_text} onChange={handleChangeSearch} value={searchData.grade} />
                            </div>
                        </div>
                      

                        < div className="text-xl md:my-0 mx-2 ">
                            <div className={styles.input_group}>
                                <input type="text" name="subject" placeholder="Subject" className={styles.input_text} onChange={handleChangeSearch} value={searchData.subject} />
                            </div>
                        </div>



                        < div className="text-xl md:my-1  ">
                            <div className={styles.button}>
                                <button onClick={handleSearch} className='text-center pl-3 pr-3'>
                                    search
                                </button>
                            </div> </div>

                    </div>
                </div>


                <div className="w-3/5  mx-auto" style={{minHeight:'78vh'}}>




                    <div className="title mb-6">
                        <h1 className="text-white-800 text-4xl font-bold py-6 text-center">
                            EXIT PDF LIST
                        </h1>

                    </div>




                    <table className="min-w-full min-h-full ">
                        <thead className="border-b">
                            <tr>
                                <th className="p-5 text-center">GRADE</th>
                                <th className="p-5 text-center">SUBJECT</th>
                                <th className="p-5 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableData.length > 0 && tableData.map((item, i) => (
                                
                                <tr key={i} className="border-b text-center" >
                                    
                                    <td onClick={()=>handlerowClick(item.id)}>
                                        {item.grade}
                                    </td> 
                                
                                    <td className="p-5 text-center" onClick={()=>handlerowClick(item.id)}>{item.subject}</td>
                                    <td className="p-5 text-center">

                                        <button onClick={() => removeItemHandler(item)}>
                                            <HiOutlineX className="h-5 w-5" color='red'></HiOutlineX>
                                        </button>
                                    </td>
                                   
                                </tr>
                                
                            ))}
                        </tbody>
                    </table>






                </div>


            </div>
        </Layout>
    )
}

export default withProtected(UpdateMenu)
