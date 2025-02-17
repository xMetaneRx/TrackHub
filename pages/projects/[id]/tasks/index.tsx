import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import ITask from "../../../../types/task";
import TaskList from "../../../../components/TaskList";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Alert, Box } from "@mui/material";
import Head from "next/head";
import TaskListHeader from "../../../../components/TaskListHeader";
import { prismaClient } from "../../../../utils/prisma";

export default function Tasks({
  tasks: propTasks,
  isAuthorized,
}: {
  tasks?: ITask[];
  isAuthorized: boolean;
}) {
  const [ID, setID] = useState<undefined | string>();
  const [tasks, setTasks] = useState(propTasks);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthorized) {
      setTimeout(() => {
        router.push("/");
      }, 3000);
    } else {
      setID(window.location.href.split("/")[4]);
    }
  }, [isAuthorized]);

  return (
    <>
      <Head>
        <title>TrackHub | Task List</title>
      </Head>
      {!isAuthorized ? (
        <Alert severity="error">
          You are not authorized to access this page. You will be redirected to
          the homepage.
        </Alert>
      ) : (
        <Box>
          <TaskListHeader ID={ID} />
          <TaskList tasks={tasks} setTasks={setTasks} />
        </Box>
      )}
    </>
  );
}

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    try {
      const session = await getSession(ctx.req, ctx.res);
      const prisma = prismaClient;
      const { id } = ctx.query;
      let data;

      const tasks = await prisma.task.findMany({
        where: {
          projectId: id as string,
        },
        include: { Project: true, comments: true },
      });

      if (
        tasks.some(
          (task) =>
            task.authorId === session?.user.email ||
            task.Project.assignees.includes(session?.user.email)
        )
      ) {
        data = {
          tasks,
          isAuthorized: true,
        };
      } else {
        const project = await prisma.project.findFirst({
          where: {
            id: id as string,
          },
        });

        if (
          project?.creator === session?.user.email ||
          project?.assignees.includes(session?.user.email)
        ) {
          data = {
            tasks: [],
            isAuthorized: true,
          };
        } else {
          data = {
            tasks: [],
            isAuthorized: false,
          };
        }
      }

      return {
        props: {
          ...data,
        },
      };
    } catch (err) {
      return {
        props: {
          isAuthorized: false,
          tasks: [],
        },
      };
    }
  },
});
