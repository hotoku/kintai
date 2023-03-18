import { useState } from "react";

type Deal = {
  id: number;
  name: string;
};

function Deals(): JSX.Element {
  const [deals, setDeals] = useState<Deal[]>([]);

  return <>deals</>;
}

export default Deals;
