import { useEffect, useState } from "react";
import MuiButton from "./MuiButton";
import { toast } from "react-toastify";
import SearchField from "./SearchField";
import PersistentDrawerLeft from "./Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { setAllParas } from "../Slices/paragraphsSlice";
import {
  useGetAllParagraphsQuery,
  useAddParagraphMutation,
  useSearchParaWithPageNumberQuery,
  useFindByIDQuery,
} from "../Slices/paragraphsApiSlice";
import io from "socket.io-client";
import CustomNotification from "./Notification";
import { Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { removeUserInfo } from "../Slices/usersSlice";

const Form = () => {
  //states
  const [text, setText] = useState("");
  const [count, setCount] = useState(0);
  const [ip, setIp] = useState();
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState("");
  const [data, setData] = useState("");
  const [paragraphs, setParagraphs] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [flagged, setFlagged] = useState(false);
  const [paraId, setParaId] = useState("");

  //redux
  const dispatch = useDispatch();
  const paragraphsFromRedux = useSelector(
    (state) => state.paragraphs.paragraphs
  );
  const user = useSelector((state) => state.login.userInfo);
  const pageNumber = useSelector((state) => state.paragraphs.pageNumber);
  const flaggedItem = useSelector((state) => state.paragraphs.flaggedItem);
  const userId = useSelector((state) => state.paragraphs.userId);
  const paragraphId = useSelector((state) => state.paragraphs.paragraphId);
  const {
    data: docs,
    isLoading: loadingDocs,
    isError: isErrorWithPage,
    refetch,
  } = useSearchParaWithPageNumberQuery({
    keyword: search ? search : "",
    page: pageNumber,
    userId: user.sub,
    role: user.role,
  });
  const [addParagraph, { isLoading, isError, data: addParagraphData }] =
    useAddParagraphMutation();
  const { data: paraData } = useFindByIDQuery(paraId);

  //functions
  const handleSubmit = (e) => {
    e.preventDefault();
    addData(text);
  };

  const addData = async (text) => {
    try {
      const result = await addParagraph({
        paragraph: text,
        ip,
      }).unwrap();
      setCount(result.count);
      setUrl(`http://localhost:3000${result.pdfDownloadLink}`);
      setData(result.pdfDownloadLink);
      setText("");
      refetch();
    } catch (error) {
      setCount(0);
      console.log(error?.data?.message);
      toast.error(error?.data?.message);
    }
  };

  const getDocs = async () => {
    console.log(docs, "docs");
    const sortedData =
      sortOrder === "asc"
        ? [...docs.docs].sort(
            (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
          )
        : [...docs.docs].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
    setParagraphs(sortedData.map((r) => r.para));
    console.log(sortedData, "sorted data");
    dispatch(setAllParas(sortedData));
    console.log(docs, "docs api slice");
  };

  const handleLogoutGuest = () => {
    dispatch(removeUserInfo());
  };

  const onClick = () => {
    const pdfUrl = data;
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.target = "_blank";
    link.download = "WordCount.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // useEffects

  useEffect(() => {
    console.log(paraData, "paraData");
  }, [paraData, paraId]);

  useEffect(() => {
    const socket = io("http://localhost:3000");

    const handleConnect = () => {
      console.log("Socket connected");
      if (user) {
        let finalId = userId === "" ? user.sub : userId;
        socket.emit("join", finalId);
        console.log("User connected to socket:", finalId);
      }
    };

    socket.on("notification", (data) => {
      console.log("Received notification:", data);
      setParaId(data.id);
      setMessage(data.message);
      setOpen(true);
    });

    socket.on("connect", handleConnect);

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    return () => {
      socket.off("notification");
      socket.off("connect");
      socket.off("connect_error");
    };
  }, [user, userId]);

  const handleClose = () => {
    setOpen(false);
  };

  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

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
    console.log(docs, "docsss");
    if (docs) {
      refetch();
      getDocs();
    }
  }, [sortOrder]);

  return (
    <div className="h-[100%] flex flex-col items-center justify-center">
      <PersistentDrawerLeft
        paragraphs={paragraphs}
        setText={setText}
        setCount={setCount}
        setUrl={setUrl}
        toggle={toggleSortOrder}
        search={search}
        setSearch={setSearch}
        setData={setData}
        setFlagged={setFlagged}
      />
      <form onSubmit={handleSubmit} className="form mt-20">
        <div className="textInput flex flex-col">
          <label className="text-2xl font-bold mb-4" htmlFor="para">
            Enter Your Paragraph
          </label>
          <textarea
            className="p-1 bg-white w-[90%] border-2 rounded-md resize-none h-32"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            cols={50}
            id="para"
          />
        </div>
        <MuiButton loading={isLoading} text={"submit"} refetch={refetch} />
      </form>
      <div>
        <p className="mt-2">Words in document: {count}</p>
      </div>
      {url && (
        <>
          <MuiButton text={"Download PDF"} url={url} onClick={onClick} />
        </>
      )}
      {user.role === "anonymous" && (
        <Typography
          sx={{
            mt: 2,
          }}
        >
          Explore All Features{" "}
          <Link onClick={handleLogoutGuest} to={"/login"}>
            Login
          </Link>
        </Typography>
      )}
      {user.role !== "admin" && (
        <CustomNotification
          open={open}
          handleClose={handleClose}
          message={message}
          paraId={paraId}
          setText={setText}
          setCount={setCount}
          setUrl={setUrl}
          setData={setData}
        />
      )}
    </div>
  );
};

export default Form;
