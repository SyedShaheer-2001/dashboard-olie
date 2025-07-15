
import PageContainer from "@/app/components/container/PageContainer";
import Posts from "@/app/components/shared/Posts";


export default function SamplePage() {

  return (
    <PageContainer title="Sample Page" description="this is Sample page">
      <Posts/>
    </PageContainer>
  );
};

export const metadata = { title: "My Page" };
