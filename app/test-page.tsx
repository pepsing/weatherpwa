"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">测试样式页面</h1>

      <div className="mb-4">
        <Button variant="default">默认按钮</Button>
        <Button variant="destructive" className="ml-2">
          危险按钮
        </Button>
        <Button variant="outline" className="ml-2">
          轮廓按钮
        </Button>
        <Button variant="ghost" className="ml-2">
          幽灵按钮
        </Button>
      </div>

      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>卡片标题</CardTitle>
        </CardHeader>
        <CardContent>
          <p>这是一个测试卡片，用于验证样式是否正常工作。</p>
        </CardContent>
      </Card>

      <div className="mt-8 p-4 bg-blue-100 dark:bg-blue-900 rounded-lg">
        <p className="text-blue-800 dark:text-blue-200">这是一个使用原生 Tailwind 类的元素</p>
      </div>
    </div>
  )
}

