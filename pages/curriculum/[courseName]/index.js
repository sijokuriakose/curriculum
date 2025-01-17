import { getAllCourseIds, getCourseData } from "../../../lib/jslist";
import { getCourse } from "../../../lib/getCourse";
import Navbar from "../../../component/layout/NavBar/NavBar";
import Head from "next/head";
import Link from "next/link";

export async function getStaticPaths() {
  const paths = await getAllCourseIds();
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const courseData = await getCourseData(params.courseName);
  // console.log(courseData);
  return {
    props: {
      params,
      courseData,
    },
  };
}

export default function CourseName({ courseData, params }) {
  // console.log(courseData, params);
  const currentCourseName = params.courseName;

  let currentCourse = getCourse(currentCourseName);
  // console.log(currentCourse);

  let { courseName, courseUrl } = currentCourse;
  let currentChapters = currentCourse.chapters;
  // console.log(courseName, currentChapters);

  return (
    <div>
      <Head>
        <title> {courseName} | Curriculum</title>
      </Head>
      <Navbar showMenuIcon={false} showTitle={false} />
      <div className="bg-gray-50 h-screen">
        <h1 className="uppercase text-2xl tracking-widest text-center p-8">
          {courseName}
        </h1>
        <div className="flex flex-col items-center justify-center">
          {currentChapters.map((chapter) => (
            <div
              key={chapter.chapterUrl + courseUrl}
              className="bg-white m-2 px-12 h-14 w-2/4 flex flex-row items-center shadow-md text-xl tracking-wider hover:shadow-lg"
            >
              <Link href={`/curriculum/${courseUrl}/${chapter.chapterUrl}`}>
                <a className="text-gray-700 font-medium hover:text-purple-800">
                  {chapter.chapterName}
                </a>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
