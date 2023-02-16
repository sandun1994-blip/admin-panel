import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '../../styles/Form.module.css'
import { HiAtSymbol, HiFingerPrint } from "react-icons/hi";
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
import { CirclesWithBar } from 'react-loader-spinner';





function PaperId(props) {


    const [visible, setVisible] = useState(false)

    const { editid } = props.query


    const colRef = collection(db, 'pdf-data')

    const colRefTwo = collection(db, 'grade-data')

    const colRefThree = (db, 'pdf-data')

    const [file, setFile] = useState(null)
    const [progress, setProgress] = useState(0)
    const [editData, setEditData] = useState({
        subject: '',
        year: 2023,
        grade: '',
        semester: 'main',
        title: '',
        description: '',
        school: 'none'
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
        setVisible(true)
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
        setVisible(false)
    }

    const deleteFile = async () => {
        setVisible(true)
        const desertRef = ref(storage, editData.name);

        // Delete the file
        deleteObject(desertRef).then(() => {

            const path = `/pdf/${editData.grade}/${editData.subject}/${editData.semester}/${uuidv4()}`
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



        }).catch((error) => {
            // Uh-oh, an error occurred!
        });

        setVisible(false)
    }

    const editDataHandle = async () => {
        addGradeData()
        await setDoc(doc(db, "pdf-data", editid), {
            ...editData
        }).then(res => {
            toast.success(`success`, { theme: 'colored' })
        }).catch(err => {
            toast.error(`unsuccess`, { theme: 'colored' })
        })
    }


    const addPdfData = async (url, name) => {

        await setDoc(doc(db, "pdf-data", editid), {
            ...editData, pdfLink: url, name
        }).then(res => {
            toast.success(`success`, { theme: 'colored' })
        }).catch(err => {
            toast.error(`unsuccess`, { theme: 'colored' })
        })
    }
    const addGradeData = async () => {
        const dataObj = { subject: '', year: [], grade: '' }
        const exitData = await getaDataByGradeAndSubject(editData.grade, editData.subject)

        if (exitData?.length > 0) {

            const checkYear = exitData[0]?.year.includes(editData.year) ? exitData[0]?.year.includes(editData.year) : false
            if (!checkYear) {
                await setDoc(doc(db, "grade-data", exitData[0].id), {
                    ...exitData[0], year: [...exitData[0]?.year, editData.year]
                });

            }

        } else {

            await addDoc(colRefTwo, { ...dataObj, subject: editData.subject, year: [editData.year], grade: editData.grade }).then(() => {
                console.log('sucess two');
            })
        }






    }



    const handleChange = (e) => {
        if (e.target.name === 'year') {
            console.log('ok');
            setEditData({ ...editData, [e.target.name]: Number(e.target.value) })
        } else {
            setEditData({ ...editData, [e.target.name]: e.target.value })
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




    const getaDataById = async () => {

        console.log(editid);
        const docRef = doc(db, 'pdf-data', editid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
            setEditData(docSnap.data())
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
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
                        <input type="number" name="year" placeholder="Year" className={styles.input_text} onChange={handleChange} value={Number(editData.year)} />

                    </div>
                    <div className={styles.input_group}>
                        <select
                            className={styles.input_text}
                            value={editData.semester}
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
                    <div className={styles.input_group}>
                        <input type="text" name="school" placeholder="school or university" className={styles.input_text} onChange={handleChange} value={editData.school} />

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



export default withProtected(PaperId)