
import PageContainer from "@/app/components/container/PageContainer";
import Events from "@/app/components/shared/Events";


export default function SamplePage() {

  return (
    <PageContainer title="Sample Page" description="this is Sample page">
      <Events/>
    </PageContainer>
  );
};

export const metadata = { title: "My Page" };
