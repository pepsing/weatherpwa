export default function MinimalTest() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-blue-600">最小测试页面</h1>
      <p className="text-gray-700 mt-2">这个页面仅使用基本的 Tailwind 类。</p>

      <div className="mt-4 p-4 bg-gray-100 rounded-lg">
        <p>如果这个元素有正确的样式，说明 Tailwind CSS 基础配置正常。</p>
      </div>

      <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">测试按钮</button>
    </div>
  )
}

