"use server";

import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import {
  GetAllTagsParams,
  GetQuestionsByTagIdParams,
  GetTopInteractedTagsParams,
} from "./shared.types";
import Tag, { ITag } from "@/database/tag.model";
import Question from "@/database/question.model";
import { FilterQuery } from "mongoose";

export async function getTopInteractedTags(params: GetTopInteractedTagsParams) {
  try {
    connectToDatabase();

    const { userId } = params;

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    return [
      { _id: "1", name: "tag1" },
      { _id: "2", name: "tag2" },
      { _id: "3", name: "tag3" },
    ];
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function getAllTags(params: GetAllTagsParams) {
  try {
    connectToDatabase();

    const { searchQuery, filter, page = 1, pageSize = 10 } = params;

    const skipAmount = (page - 1) * pageSize;

    const query: FilterQuery<typeof Tag> = {};

    if (searchQuery) {
      query.$or = [{ name: { $regex: new RegExp(searchQuery, "i") } }];
    }
    let sortOptions = {};

    switch (filter) {
      case "old":
        sortOptions = { createdAt: 1 };
        break;
      case "popular":
        sortOptions = { questions: -1 };
        break;
      case "recent":
        sortOptions = { createdAt: -1 };
        break;
      case "name":
        sortOptions = { name: 1 };
        break;

      default:
        sortOptions = { name: 1 };
        break;
    }

    const totalTags = await Tag.countDocuments();
    const tags = await Tag.find(query)
      .skip(skipAmount)
      .limit(pageSize)
      .sort(sortOptions);

    const isNext = totalTags > skipAmount + tags.length;
    return { tags, isNext };
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function getQuestionsByTagId(params: GetQuestionsByTagIdParams) {
  try {
    connectToDatabase();

    const { tagId, page = 1, pageSize = 10, searchQuery } = params;

    const skipAmount = (page - 1) * pageSize;

    const tagFilter: FilterQuery<ITag> = { _id: tagId };

    const tag = await Tag.findOne(tagFilter).populate({
      path: "questions",
      model: Question,
      match: searchQuery
        ? { title: { $regex: searchQuery, $options: "i" } }
        : {},
      options: {
        skip: skipAmount,
        limit: pageSize + 1,
        sort: { createdAt: -1 },
      },
      populate: [
        { path: "tags", model: Tag, select: "_id name" },
        { path: "author", model: User, select: "_id clerkId name picture" },
      ],
    });

    if (!tag) {
      throw new Error("Tag not found");
    }

    const questions = tag.questions;
    const isNext = tag.question.length > pageSize;

    return { tagTitle: tag.name, questions, isNext };
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function getTopPopularTags() {
  try {
    connectToDatabase();
    const hotTags = await Tag.aggregate([
      {
        $project: {
          name: 1,
          numberOfQuestions: {
            $size: "$questions",
          },
        },
      },
      {
        $sort: {
          numberOfQuestions: -1,
        },
      },
      {
        $limit: 5,
      },
    ]);
    return hotTags;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
