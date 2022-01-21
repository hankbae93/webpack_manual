import React, { useEffect, useState } from "react";

const App: React.FC = () => {
  const [load, setLoad] = useState<boolean>(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoad(true);
    }, 2000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      <h1>{load ? `HOME ${getRandomNumber()}` : "LOADING..."}</h1>
      <p>이제 진짜 적용되는거맞지?</p>
    </>
  );

  function getRandomNumber(): number {
    return Math.random() * 9;
  }
};

export default App;
