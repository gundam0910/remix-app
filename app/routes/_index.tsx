import type { MetaFunction } from '@remix-run/node';

export const meta: MetaFunction = () => {
    return [
        { title: "Remix Book app"}
    ];
};

export default function Index() {
    return (
        <div className="container mx-auto px-4">
            sample
        </div>
    );
}