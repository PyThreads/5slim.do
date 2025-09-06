"use client"
import React, { useCallback, useEffect, useState } from "react";
import CreateArticleForm from "../../moduleComponents/forms/createArticleForm";
import { useParams, useRouter } from 'next/navigation';
import { articleService } from "../../articleService";
import SplashScreen from "../../../../../providers/SplashScreen";
import { IArticle } from "../../../../../../api/src/interfaces";

export default function NewArticlePage() {
    const params = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [article, setArticle] = useState<IArticle | null>(null);

    if (!params._id) {
        router.push(`/admin/dashboard/inventory/newArticle/${params._id}`)
    }

    const getArticleById = useCallback(async () => {
        try {
            const article = await articleService.getArticleDetails({ _id: params._id });
            setArticle(article)
        } finally {
            setLoading(false)
        }
    }, [params])

    useEffect(() => {
        getArticleById();
    }, [getArticleById])

    return (
        <React.Fragment>
            {
                loading ?
                    (
                        <SplashScreen />
                    ) :
                    (
                        <CreateArticleForm valuesToEdit={article} onClose={() => { }} />
                    )
            }
        </React.Fragment>
    )
}