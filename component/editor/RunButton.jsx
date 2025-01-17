import { test } from "gray-matter";
import React, { useContext } from "react";
import UserContext from "../../context/user/userContext";
import { courses } from "../../courses/meta";
const axios = require("axios");
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Runbutton({ editorVal, courseName, chapterName }) {
  const globalState = useContext(UserContext);
  const testCase = globalState.test;

  let clicked = false;
  let flag = false;

  const notify = (err) => {
    console.log(err);
    toast.success(err, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined
    });
  };

  const clickHandle = () => {
    clicked = true;
    globalState.setRun(clicked);

    let i = 0;

    while (i < editorVal.length) {
      // console.log(i);
      editorVal[i] = editorVal[i].replace(/\s\s+/g, "");
      // console.log(editorVal[i]);

      editorVal[i] = editorVal[i].replace(/"+/g, "'");
      // console.log(editorVal[i]);

      if (editorVal[i] === "{") {
        editorVal[i - 1] = editorVal[i - 1] + "{";
        editorVal.splice(i, 1);
        // console.log(i);
        continue;
      }
      // console.log(editorVal[i]);
      if (i < testCase.length) {
        if (testCase[i].case.includes(editorVal[i])) {
          testCase[i].isCorrect = true;
        } else {
          testCase[i].isCorrect = false;
        }
      }
      i = i + 1;
    }
    for (let i = 0; i < testCase.length; i++) {
      if (testCase[i].isCorrect) {
        flag = true;
      } else {
        flag = false;
        break;
      }
    }
    if (flag) {
      let cook = document.cookie;
      cook = cook.split("=");
      cook[0] !== ""
        ? (cook = JSON.parse(cook[1]).accessToken)
        : (cook = false);
      if (cook) {
        axios({
          method: "post",
          mode: "no-cors",
          url: `http://localhost:8080/api/enrol/${courseName}/${chapterName}`,
          headers: {
            "x-access-token": `${cook}`
          }
        }).then((response) => {
          if (response.data.entryAdded) {
            notify("👍 Chapter Is Completed!");
          } else {
            notify(`👍 ${response.data}`);
          }
        });
      }
      let index = 0;
      let progress = JSON.parse(window.localStorage.getItem("progress")) || [
        { courseName: "", completedChapter: [] }
      ];
      // console.log(progress);
      let chapterList = new Set(progress[index].completedChapter);
      chapterList.add(chapterName);
      chapterList = [...chapterList];
      let progressItem = {
        courseName: courseName,
        completedChapter: chapterList
      };
      progress[index] = progressItem;
      window.localStorage.setItem("progress", JSON.stringify(progress));
    }
    globalState.setTest(testCase);
  };
  return (
    <div className="absolute bottom-14">
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <button
        className={`bg-green-600  text-white font-medium py-1 px-3 ml-4 mt-20 rounded-sm ${
          !testCase && "disabled:opacity-50"
        }`}
        onClick={clickHandle}
        disabled={!testCase}
      >
        Run
      </button>
    </div>
  );
}
