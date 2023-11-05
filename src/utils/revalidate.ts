import env from "../env";

const revalidate = async (value: string) => {
    await fetch(`${env.FRONT_URL}/api/revalidate?user=${value}&secret=${env.REVALIDATE_TOKEN}`);
};

export default revalidate;