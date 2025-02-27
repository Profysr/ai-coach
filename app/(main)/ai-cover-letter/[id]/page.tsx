import React from "react";

interface PageProps {
  params: {
    id: string;
  };
}

const page = ({ params }: PageProps) => {
  const id = params.id;
  console.log("Dynamic Cover Letter ID", id);

  return <div>Cover Letter {id}</div>;
};

export default page;
