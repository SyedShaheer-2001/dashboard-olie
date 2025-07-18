
import PageContainer from "@/app/components/container/PageContainer";
import Categories from "@/app/components/shared/Categories";


export default function SamplePage() {

  return (
    <PageContainer title="Sample Page" description="this is Sample page">
      <Categories/>
    </PageContainer>
  );
};

export const metadata = { title: "My Page" };
