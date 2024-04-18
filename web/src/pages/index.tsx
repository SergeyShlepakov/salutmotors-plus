import Head from "next/head";
import {Inter} from "next/font/google";
import Table from "react-bootstrap/Table";
import {Alert, Container} from "react-bootstrap";
import {GetServerSideProps, GetServerSidePropsContext} from "next";
import MyPagination from "@/components/MyPagination";
import { useState } from "react";

const inter = Inter({subsets: ["latin"]});

type TUserItem = {
  id: number
  firstname: string
  lastname: string
  email: string
  phone: string
  updatedAt: string
}

type TGetServerSideProps = {
  statusCode: number
  count: number
  users: TUserItem[]
}


export const getServerSideProps = (async (ctx: GetServerSidePropsContext): Promise<{ props: TGetServerSideProps }> => {
  try {
    const res = await fetch("http://localhost:3000/users", {method: 'GET'})
    if (!res.ok) {
      return {props: {statusCode: res.status, count: 0, users: []}}
    }

    const response = await res.json();
    return {
      props: {statusCode: 200, count: response.count, users: response.users}
    }
  } catch (e) {
    return {props: {statusCode: 500, count: 0, users: []}}
  }
}) satisfies GetServerSideProps<TGetServerSideProps>


export default function Home({statusCode, count, users}: TGetServerSideProps) {
  const initialPage = 1;
  const [ currentPage, setCurrentPage ] = useState(initialPage);
  const [ rStatusCode, setRStatusCode ] = useState(statusCode);
  const [ pageCount, setPageCount ] = useState(count);
  const [ userList, setUserList ] = useState(users);

  if (rStatusCode !== 200) {
    return <Alert variant={'danger'}>Ошибка {rStatusCode} при загрузке данных</Alert>
  }

  async function navigateToPage(page: number) {
    if (!page || currentPage === page) {
      return;
    }

    setCurrentPage(page);

    const res = fetch(`http://localhost:3000/users?page=${page}`, {method: 'GET'})

    res.then(async (rs) => {
      try {
        const response = await rs.json();

        setRStatusCode(rs.status);
        if (rs.ok) {
          setPageCount(response.count);
          setUserList(response.users);
        } else {
          setPageCount(0);
          setUserList([]);
        }
      } catch (err) {
        console.error(err);
      }
    });
  }

  return (
    <>
      <Head>
        <title>Тестовое задание</title>
        <meta name="description" content="Тестовое задание"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <link rel="icon" href="/favicon.ico"/>
      </Head>

      <main className={inter.className}>
        <Container>
          <h1 className={'mb-5'}>Пользователи</h1>

          <Table striped bordered hover>
            <thead>
            <tr>
              <th>ID</th>
              <th>Имя</th>
              <th>Фамилия</th>
              <th>Телефон</th>
              <th>Email</th>
              <th>Дата обновления</th>
            </tr>
            </thead>
            <tbody>
            {
              userList.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.firstname}</td>
                  <td>{user.lastname}</td>
                  <td>{user.phone}</td>
                  <td>{user.email}</td>
                  <td>{user.updatedAt}</td>
                </tr>
              ))
            }
            </tbody>
          </Table>

          <MyPagination count={pageCount} page={initialPage} navigate={navigateToPage}></MyPagination>

        </Container>
      </main>
    </>
  );
}
