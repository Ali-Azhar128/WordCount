import { useEffect, useState } from "react"
import MuiButton from "./MuiButton"
import { toast } from 'react-toastify'
import SearchField from "./SearchField"
import PersistentDrawerLeft from "./Sidebar"
import { useDispatch } from "react-redux"
import { setAllParas } from "../Slices/paragraphsSlice"
import { useGetAllParagraphsQuery, useAddParagraphMutation } from "../Slices/paragraphsApiSlice"


const Form = () => {
    //states
    const [text, setText] = useState('')
    const [count, setCount] = useState(0)
    const [ip, setIp] = useState()
    const [loading, setLoading] = useState(false)
    const [url, setUrl] = useState('')
    const [data, setData] = useState('')
    const [paragraphs, setParagraphs] = useState([])
    const [sortOrder, setSortOrder] = useState('asc')

    //redux
    const dispatch = useDispatch()
    const { data: docs, loading: loadingDocs, refetch } = useGetAllParagraphsQuery()
    const [addParagraph, { isLoading, isError, data: addParagraphData }] = useAddParagraphMutation()
    //functions
    const handleSubmit = (e) => {
        e.preventDefault()
        addData(text)

    }

    const addData = async (text) => {
      try {

        const result = await addParagraph({ paragraph: text, ip }).unwrap()
        setCount(result.count)
        setUrl(`http://localhost:3000${result.pdfDownloadLink}`)
        setData(result.pdfDownloadLink)
        setText('')
      } catch (error) {
        setCount(0)
        console.log(error.message)
        toast.error(error.message)
      }
    }

    const getDocs = async () => {
      const data = await fetch('http://localhost:3000/getAll');
      const res = await data.json();
      dispatch(setAllParas(res));
      console.log(res, 'res')
      const sortedData = sortOrder === 'asc' ? res.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)) : res.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      console.log(sortedData, 'new sorted data')
      console.log(sortOrder, 'order')
      setParagraphs(sortedData.map(r => r.para));
      console.log(paragraphs, 'paragraphs');
      console.log(res, 'All Documents');
    };

    const toggleSortOrder = () => {
      setSortOrder(prevOrder => (prevOrder === 'asc' ? 'desc' : 'asc'))
    }

    // Button to download PDF
    const onClick = () => {
      const pdfUrl = data
      const link = document.createElement('a')
      link.href = pdfUrl
      link.target = '_blank'
      link.download = 'WordCount.pdf'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
  }

    //useEffects
    useEffect(() => {
      const fetchIp = async () => {
          try {
            const response = await fetch("https://api.ipify.org?format=json");
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            const data = await response.json();
            setIp(data.ip);
          } catch (error) {
            console.error("Error fetching IP address:", error);
          }
        };
  
      fetchIp();
    }, []);

    useEffect(() => {
      getDocs()
    }, [sortOrder])

    useEffect(() => {
      if(!loadingDocs) {
        console.log(docs, 'docs api slice')
      }
    }, [loadingDocs, docs])

    

    return (
        <div className="h-[100%] flex flex-col items-center justify-center">
          <PersistentDrawerLeft paragraphs={paragraphs} setText={setText} toggle={toggleSortOrder}/>
          <SearchField setParagraph={setParagraphs}/>
            <form onSubmit={handleSubmit} className="form mt-20">
                <div className="textInput flex flex-col">
                    <label className="text-2xl font-bold mb-4" htmlFor="para">Enter Your Paragraph</label>
                    <textarea className="text-white p-4" value={text} onChange={(e) => setText(e.target.value)} rows={4} cols={50} id='para'/>
                </div>
                <MuiButton loading={isLoading} text={'submit'}/>
            </form>
            <div>
                <p className="mt-2">Words in document: {count}</p>
            </div>
            {url && 
            <>
                <MuiButton text={'Download PDF'} url={url} onClick={onClick}/>
            </>}
        </div>
    )
}

export default Form
