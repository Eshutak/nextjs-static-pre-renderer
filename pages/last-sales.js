import { useEffect, useState } from "react";
import useSWR from "swr";

const baseURL = "https://nextjs-course-99fb2-default-rtdb.firebaseio.com";

export default function LastSalesPage(props) {
  // const [isLoading, setIsLoading] = useState();
  const [sales, setSales] = useState(props.sales);

  const { data, error } = useSWR(`${baseURL}/sales.json`, (url) =>
    fetch(url).then((response) => response.json()),
  );

  useEffect(() => {
    console.log(data);
    if (data) {
      const transformedSales = [];
      for (const key in data) {
        transformedSales.push({
          id: key,
          username: data[key].username,
          volume: data[key].volume,
        });
      }
      setSales(transformedSales);
    } else {
      console.log("data is not exist");
    }
  }, [data]);

  // useEffect(() => {
  //   setIsLoading(true);
  //   fetch(`${baseURL}/sales.json`)
  //     .then((response) => response.json())
  //     .then((data) => {
  //       const transformedSales = [];
  //       for (const key in data) {
  //         transformedSales.push({
  //           id: key,
  //           username: data[key].username,
  //           volume: data[key].volume,
  //         });
  //       }
  //       setSales(transformedSales);
  //       setIsLoading(false);
  //     });
  // }, []);

  // if (isLoading) {
  //   return <p>Loading data...</p>;
  // }

  // if (!sales) {
  //   return <p>No datas yet</p>;
  // }

  if (error) {
    return <p>Failed Error</p>;
  }

  if (!data && !sales) {
    return <p>Loading data...</p>;
  }

  return (
    <ul>
      {sales.map((sale) => (
        <li key={sale.id}>
          {sale.username} - ${sale.volume}
        </li>
      ))}
    </ul>
  );
}

export async function getStaticProps() {
  const response = await fetch(`${baseURL}/sales.json`);
  const data = await response.json();

  const transformedSales = [];
  for (const key in data) {
    transformedSales.push({
      id: key,
      username: data[key].username,
      volume: data[key].volume,
    });
  }
  return { props: { sales: transformedSales }, revalidate: 10 };
}
