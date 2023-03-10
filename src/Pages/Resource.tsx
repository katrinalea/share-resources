import { useParams } from "react-router-dom";
import { IResource, IUser, IComment } from "../interfaces";
import { formatTags } from "../utils/formatTags";
import NewComment from "../components/NewComment";
import { useEffect, useState } from "react";
import { url } from "../App";
import axios from "axios";
import formatSubmissionDate from "../utils/formatSubmissionDate";

interface ResourceProps {
  users: IUser[];
  allResources: IResource[] | [];
  userID: number | null;
}

export function Resource({
  allResources,
  users,
  userID,
}: ResourceProps): JSX.Element {
  const [comments, setComments] = useState<IComment[]>([]);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const { resourceID } = useParams();

  useEffect(() => {
    const fetchComments = async () => {
      const completeURL = url + `/resources/${resourceID}/comments`;

      const response = await fetch(completeURL);
      const responseJSON = await response.json();

      if (responseJSON.length > 0) {
        setComments(responseJSON);
      }
    };
    fetchComments();
  }, [resourceID, setSubmitted, submitted]);

  const oneResourceArray = allResources.filter(
    (resource) => resource.resource_id === Number(resourceID)
  );
  if (oneResourceArray.length < 1) {
    console.error("expected full array, got an empty oneResourceArray");
  }
  const oneResource = oneResourceArray[0];
  const filteredUser = users.filter(
    (user) => user.user_id === oneResource.user_id
  );

  const handleAddToDoList = async (userID: number, resourceID: number) => {
    await axios.post(url + "/to-do-list", {
      resource_id: resourceID,
      user_id: userID,
    });
    window.alert("Added the post to your to do list");
  };

  return (
    <>
      <h1>{oneResource.resource_name}</h1>
      <h2>{oneResource.author_name}</h2>
      <p>
        <b>description: </b>
        {oneResource.resource_description}
      </p>
      <p>
        <b>reason for recommendation: </b>
        {oneResource.recommendation_reason}
      </p>
      <a href={oneResource.resource_url}>{oneResource.resource_url}</a>
      <p>
        <b>submitted by: </b>
        {filteredUser[0].user_name}
      </p>
      <p>
        {" "}
        <b>submitted on: </b>
        {formatSubmissionDate(oneResource.time_of_post)}
      </p>
      <p>
        <b>which Selene week should you do it in? </b>
        {oneResource.selene_week}
      </p>
      <p>
        <b>content type: </b>
        {oneResource.content_type}
      </p>
      <p>
        <b>uploader usage status: </b>
        {oneResource.usage_status}
      </p>
      <b>tags: </b>
      {formatTags(oneResource.tags).map((tag, i) => (
        <p key={i}> {tag}</p>
      ))}
      {userID && (
        <button
          className="button-30"
          onClick={() => handleAddToDoList(userID, Number(resourceID))}
        >
          Add to To Do List
        </button>
      )}
      {userID && resourceID && (
        <NewComment
          userID={userID}
          resourceID={parseInt(resourceID)}
          submitted={setSubmitted}
        />
      )}
      {comments.map((comment) => (
        <>
          <p>
            Comment posted by: User-
            {
              users.filter((user) => comment.user_id === user.user_id)[0]
                .user_name
            }
          </p>
          <p key={comment.commment_id}>{comment.comment}</p>
        </>
      ))}
    </>
  );
}
