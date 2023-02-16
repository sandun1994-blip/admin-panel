import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '../../styles/Form.module.css'
import { HiAtSymbol, HiFingerPrint, HiOutlineX } from "react-icons/hi";
import { useFormik } from "formik";
import login_validate from 'lib/validate';
import { useEffect, useState } from 'react';
import Select from 'react-select';
import { db, storage } from 'firebaseConfig/firebase';
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { addDoc, collection, doc, getDoc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { v4 as uuidv4, validate } from 'uuid';
import Layout from 'components/Layout';
import { toast } from 'react-toastify';
import { withProtected } from 'hooks/route'; 





 function MenuItemId(props) {




    const { menuid } = props.query


    const colRef = collection(db, 'menu-data')

    const colRefTwo = collection(db, 'grade-data')

    const colRefThree = (db, 'menu-data')

    const [tag, setTag] = useState('')

    const [file, setFile] = useState(null)
    const [progress, setProgress] = useState(0)
    const [editData, setEditData] = useState({
        subject: '',
        grade: '',
        tag: [],
        title: '',
        description: '',
    })

    const validateData = (obj) => {

        const condition = []
        let checkCondition = true
        Object.entries(editData).forEach(([key, value]) => {
            if (value.length === 0) {
                condition.push({ key, value })
                checkCondition = false
            }


        })

        return { checkCondition, condition: condition[0] }

    }

    const uploadFiles = () => {
        const { checkCondition, condition } = validateData(editData)
        if (checkCondition) {



            if (!file) {

                editDataHandle()

            } else {

                deleteFile()



            }


        } else {

            if (!checkCondition) {
                toast.error(`Fill ${condition.key} field`, { theme: 'colored' })
            } else {
                toast.error(`choose a file`, { theme: 'colored' })
            }
        }

    }

    const deleteFile = async () => {

        const desertRef = ref(storage, editData.name);

        // Delete the file
        deleteObject(desertRef).then(() => {

            const path = `/pdf/${editData.grade}/${editData.subject}/${uuidv4()}`
            const storageRef = ref(storage, path)

            const uploadTask = uploadBytesResumable(storageRef, file)

            uploadTask.on('state_changed', (snapshot) => {

                const prog = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
                setProgress(prog)
            }, (err) => console.log(err), () => {
                getDownloadURL(uploadTask.snapshot.ref).then(
                    url => {


                        addMenuData(url, path)


                    }
                )
            })



        }).catch((error) => {
            // Uh-oh, an error occurred!
        });


    }

    const editDataHandle = async () => {

        await setDoc(doc(db, "menu-data", menuid), {
            ...editData
        }).then(res => {
            toast.success(`success`, { theme: 'colored' })
        }).catch(err => {
            toast.error(`unsuccess`, { theme: 'colored' })
        })
    }


    const addMenuData = async (url, name) => {

        await setDoc(doc(db, "menu-data", editid), {
            ...editData, menuLink: url, name
        }).then(res => {
            toast.success(`success`, { theme: 'colored' })
        }).catch(err => {
            toast.error(`unsuccess`, { theme: 'colored' })
        })
    }




    const handleChange = (e) => {
        if (e.target.name === 'year') {
            console.log('ok');
            setEditData({ ...editData, [e.target.name]: Number(e.target.value) })
        } else {
            setEditData({ ...editData, [e.target.name]: e.target.value })
        }

    }






    const getaDataById = async () => {


        const docRef = doc(db, 'menu-data', menuid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            setEditData(docSnap.data())
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }


    }
    const removeItemHandler = (tag) => {
        setEditData(pre => {
            return { ...editData, tag: editData.tag.filter(item => item != tag) }
        })
    }
    const handleTagChange =(e)=>{

        setTag(e.target.value) 
    
      }
    
    const handleAdd =()=>{
    if (tag.length>0) {
        setEditData({...editData,tag:[...editData.tag,tag]})
    
        setTag('')
    }
    
    
    }

    useEffect(() => {
        getaDataById()
    }, [])

    return (
        <Layout title='Grade5 - Home'>

            <section className="w-2/4 mx-auto">

                <div className="title mb-16">
                    <h1 className="text-white-800 text-4xl font-bold py-6 text-center">
                        PDF EDIT
                    </h1>

                </div>

                <div className="flex flex-col gap-5" >
                    <div className={styles.input_group}>
                        <input type="text" name="grade" placeholder="Grade" className={styles.input_text} onChange={handleChange} value={editData.grade} />

                    </div>

                    <div className={styles.input_group}>
            <div className='flex p-2'><button onClick={handleAdd} className='ml-5 mr-16 bg-red-600 p-5 rounded'>ADD</button> <input type="text" name="tag" placeholder="Add tag" className={styles.input_text} onChange={handleTagChange} value={tag} /></div>

          </div>

                    <div className={styles.input_group}>
                        {editData.tag.length > 0 && editData.tag.map((d, i) => {
                            return (<button key={i} className='m-5 p-5  bg-lime-500 rounded ' onClick={() => removeItemHandler(d)} >{d}<HiOutlineX className="h-5 w-5" color='red' ></HiOutlineX></button>)
                        })}

                    </div>


                    <div className={styles.input_group}>
                        <input type="text" name="subject" placeholder="Subject" className={styles.input_text} onChange={handleChange} value={editData.subject} />

                    </div>


                    <div className={styles.input_group}>
                        <input type="text" name="description" placeholder="Description" className={styles.input_text} onChange={handleChange} value={editData.description} />

                    </div>

                    <div className={styles.input_group}>
                        <input type="text" name="title" placeholder="Title" className={styles.input_text} onChange={handleChange} value={editData.title} />

                    </div>

                    <div className={styles.input_group}>
                        <input type="file" name="pdf" placeholder="select file" className={styles.input_text} onChange={(e) => setFile(e.target.files[0])} />

                    </div>


                    <div className={styles.button}>
                        <button onClick={uploadFiles} className='text-center'>
                            EDIT
                        </button>
                    </div>
                </div>
            </section>
        </Layout>
    )
}



export const getServerSideProps = async (context) => {
    const { query } = context;
    return { props: { query } };
}


export default withProtected(MenuItemId)