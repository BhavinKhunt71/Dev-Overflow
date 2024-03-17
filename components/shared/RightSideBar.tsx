import React from "react";
import Link from "next/link";
import Image from "next/image";
import RenderTag from "./RenderTag";
import { getHotQuestions } from "@/lib/actions/question.action";
import { getTopPopularTags } from "@/lib/actions/tag.action";

// const hotQuestions = [
//   {
//     _id: "1",
//     title: "How to use React Router Dom?",
//   },
//   {
//     _id: "2",
//     title: "Cascading Deletes in SQLAlchemy",
//   },
//   {
//     _id: "3",
//     title: "How to use React Router Dom?",
//   },
//   {
//     _id: "4",
//     title: "How to use React Router Dom?",
//   },
//   {
//     _id: "5",
//     title: "How to use React Router Dom?",
//   },
// ];

// const popularTags = [
//   { _id: "1", name: "javascript", totalQuestions: 5 },
//   { _id: "2", name: "react", totalQuestions: 5 },
//   { _id: "3", name: "next", totalQuestions: 5 },
//   { _id: "4", name: "vue", totalQuestions: 2 },
//   { _id: "5", name: "redux", totalQuestions: 10 },
// ];

const RightSideBar = async () => {
  const hotQuestions = await getHotQuestions();
  const popularTags = await getTopPopularTags();
  return (
    <section className="custom-scrollbar background-light900_dark200 light-border sticky right-0 top-0 flex h-screen w-[350px] flex-col  overflow-y-auto border-l p-6  pt-36 shadow-light-300 max-xl:hidden dark:shadow-none">
      <div>
        <h3 className="h3-bold text-dark200_light900">Top Questions</h3>
        <div className="mt-7 flex w-full flex-col gap-[30px]">
          {hotQuestions.map((question) => {
            return (
              <Link
                key={question._id}
                href={`/question/${question._id}`}
                className=" flex items-center justify-between gap-7"
              >
                <p className="body-medium text-dark500_light700 line-clamp-2">
                  {question.title}
                </p>
                <Image
                  src="/assets/icons/chevron-right.svg"
                  alt="chevron right"
                  width={20}
                  height={20}
                  className="invert-colors"
                />
              </Link>
            );
          })}
        </div>
      </div>

      <div className="mt-16">
        <h3 className="h3-bold text-dark200_light900">Popular Tag</h3>
        <div className="mt-7 flex flex-col gap-4">
          {popularTags.map((tag) => {
            return (
              <RenderTag
                _id={tag._id}
                key={tag._id}
                name={tag.name}
                totalQuestions={tag.numberOfQuestions}
                showCount
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default RightSideBar;
