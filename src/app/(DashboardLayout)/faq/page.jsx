
import PageContainer from "@/app/components/container/PageContainer";
import FAQ from "@/app/components/shared/FAQ";


export default function SamplePage() {

  return (
    <PageContainer title="Sample Page" description="this is Sample page">
      <FAQ/>
    </PageContainer>
  );
};

export const metadata = { title: "My Page" };
