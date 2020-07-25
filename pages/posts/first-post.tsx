import React, { useState, useCallback } from 'react';
import Head from 'next/head';
import Layout from '../../components/layout';
import Button, { ButtonGroup } from '../../components/Button/Button';

export default function FirstPost(): React.ReactNode {
  const [count, setCount] = useState(0);

  const incrementCount = useCallback(
    (e) => {
      e.preventDefault();
      setCount(count + 1);
    },
    [count],
  );

  const resetCount = useCallback(
    (e) => {
      e.preventDefault();
      setCount(0);
    },
    [count],
  );

  return (
    <Layout>
      <Head>
        <title>First Post</title>
      </Head>
      <h1>First Post</h1>
      <p className="counter">
        You&apos;ve clicked that button {count} time{count === 1 ? '' : 's'}!
      </p>
      <ButtonGroup>
        <Button href="/">Back to home</Button>
        <Button onClick={incrementCount}>Increment Count</Button>
        <Button onClick={resetCount}>Reset Count</Button>
      </ButtonGroup>
    </Layout>
  );
}
