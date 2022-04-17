import { MicroCMSListResponse } from "microcms-js-sdk";
import type { GetStaticProps, NextPage } from "next";
import Link from "next/link";
import { ComponentProps, FormEvent, FormEventHandler, useState } from "react";
import { client } from "src/libs/client";

export type Blog = {
  title: string;
  body: string;
};

type Props = MicroCMSListResponse<Blog>;

const Home: NextPage<Props> = (props) => {
  const [search, setSearch] = useState<MicroCMSListResponse<Blog>>();

  // ComponentPropsの第一引数は、JSXのエレメントを選択できる
  //ComponentPropsはコンポーネントのプロパティを取得する事ができる
  //ここでは、formのプロパティを取得しその中のonSubmitを取得する
  const handleSubmit: ComponentProps<"form">["onSubmit"] = async (e) => {
    e.preventDefault();
    //currentTargetは、フォームのがもっているプロパティやメソッドにアクセスできる
    //ここでは、formの中のinputのvalueを取得する
    //name属性を取得する
    const q = e.currentTarget.query.value;
    const data = await fetch("api/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q,
      }),
    });

    const json: MicroCMSListResponse<Blog> = await data.json();
    setSearch(json);
    console.log(json);
  };

  const handleClick: ComponentProps<"button">["onClick"] = () => {
    setSearch(undefined);
  };

  const contents = search ? search.contents : props.contents;
  const totalCount = search ? search.totalCount : props.totalCount;
  return (
    <div>
      {/* formのactionタグはReactではあまり使わない */}
      <form className="flex gap-x-2" onSubmit={handleSubmit}>
        {/* name属性でクエリー検索ができる query=? ※preventDefaultがある場合はできない*/}
        <input type="text" name="query" className="border border-black px-2" />
        <button className="border border-black px-2">submit</button>
        <button
          type="reset"
          className="border border-black px-2"
          onClick={handleClick}
        >
          リセット
        </button>
      </form>
      <p className="mt-4 text-gray-400">{`${
        search ? "記事の検索結果" : "記事の一覧"
      }: ${totalCount}件`}</p>
      <ul className="mt-4 space-y-4">
        {contents.map((content) => {
          return (
            <li key={content.id}>
              <Link href={`/blog/${content.id}`}>
                <a className="text-xl text-blue-800 underline hover:text-blue-400">
                  {content.title}
                </a>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const data = await client.getList<Blog>({ endpoint: "blog" });
  return {
    props: data,
  };
};

export default Home;
