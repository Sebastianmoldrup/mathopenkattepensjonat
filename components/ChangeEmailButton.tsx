"use client";

import React from "react";

const ChangeEmailButton = () => {
  const [clicked, setClicked] = React.useState(false);

  const handleChangeEmail = () => {
    // Implement the logic to trigger the email change process
    // This could involve calling an API route or using a server action
  };

  return (
    <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
      Change Email
    </button>
  );
};

export default ChangeEmailButton;
