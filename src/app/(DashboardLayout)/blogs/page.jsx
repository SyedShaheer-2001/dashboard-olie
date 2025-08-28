
import PageContainer from "@/app/components/container/PageContainer";
import Blogs from "@/app/components/shared/Blogs";


export default function SamplePage() {

  return (
    <PageContainer title="Sample Page" description="this is Sample page">
      <Blogs/>
    </PageContainer>
  );
};

export const metadata = { title: "My Page" };
