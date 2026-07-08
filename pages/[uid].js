export default function UserIdPage(props) {
  return <h1>{props.id}</h1>;
}

export async function getServerSideProps(context) {
  const { params } = context;
  const uid = "user-id-u" + params.uid;

  return {
    props: {
      id: uid,
    },
  };
}
