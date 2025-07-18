
import PageContainer from "@/app/components/container/PageContainer";
import Credits from "@/app/components/shared/Credits";


export default function SamplePage() {

  return (
    <PageContainer title="Sample Page" description="this is Sample page">
      <Credits/>
    </PageContainer>
  );
};

export const metadata = { title: "My Page" };
