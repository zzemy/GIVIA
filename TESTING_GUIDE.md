# 开发测试指南（无预览按钮版本）

预览按钮已删除。以下是推荐的测试方式：

## 方案1：使用Mock数据（推荐）

### 快速启用Mock数据

1. **启动开发服务器**
   ```bash
   pnpm dev
   ```

2. **打开浏览器控制台**（F12）

3. **运行命令启用Mock**
   ```javascript
   localStorage.setItem('dev_mock', '1')
   location.reload()
   ```

4. **Mock数据会自动填充**
   - Step 1（礼物信息）：自动填入示例手机数据
   - Step 2（国家选择）：自动填入日本同事数据
   - 可直接跳过到分析步骤

5. **禁用Mock**
   ```javascript
   localStorage.removeItem('dev_mock')
   location.reload()
   ```

### Mock数据位置

`lib/dev/mock-data.ts` - 包含各步骤的样本数据

可编辑以测试不同场景：
```typescript
export const mockGiftData = {
  step1: {
    giftName: '你的测试礼物',
    giftDescription: '测试描述...',
  },
}
```

---

## 方案2：E2E测试（Playwright）

```bash
# 安装 Playwright（可选）
pnpm add -D @playwright/test

# 创建测试流程
# app/[locale]/gifting/page.test.tsx
```

**示例测试代码**：
```typescript
import { test, expect } from '@playwright/test'

test('complete gifting workflow', async ({ page }) => {
  // Step 1: 输入礼物信息
  await page.goto('http://localhost:3000/zh/gifting')
  await page.fill('input[placeholder="礼物名称"]', '小米手机14')
  await page.click('button:has-text("下一步")')
  
  // Step 2: 选择国家
  await page.click('select[name="country"]')
  await page.selectOption('select[name="country"]', 'JP')
  await page.click('button:has-text("继续分析")')
  
  // Step 3: 等待分析完成
  await page.waitForSelector('[data-testid="results"]', { timeout: 180000 })
  
  // Step 4: 验证结果
  expect(await page.locator('[data-testid="results"]').isVisible()).toBeTruthy()
})
```

---

## 方案3：手动测试流程

### Step 1 - 输入礼物信息

**测试场景**：
```
1. 输入礼物：「小米手机14 Ultra」
2. 输入描述：「高端专业拍照手机」
3. 点击「下一步」
   ✓ 应验证非空
   ✓ 应禁用按钮（如果为空）
```

### Step 2 - 选择国家和受众

**测试场景1 - 基础路径**：
```
1. 选择国家：「日本 (JP)」
2. 选择受众：「同事」
3. 点击「分析礼物」
   ✓ 送导 Step 3
```

**测试场景2 - 自定义受众**：
```
1. 选择国家：「美国 (US)」
2. 选择受众：「其他」
3. 输入自定义：「初创公司CEO」
4. 点击「分析礼物」
   ✓ 应接受自定义输入
```

### Step 3（自动）- 分析生成

**预期行为**：
```
- 显示"稿件生成中..."
- 计时器开始显示已等待秒数
- 8-20秒内完成（可能达到180秒）
- 如果太久，提示"可能模型繁忙"
```

### Step 4 - 结果报告

**验证内容**：
- ✓ 显示5个主要部分（01-05）
- ✓ 分数栏显示（相关性、得体性、可行性）
- ✓ 风险评估卡片（颜色编码）
- ✓ 推荐卡片（至少1张）
- ✓ 购买链接（多个市场选项）
- ✓ 物流估计（如适用）

---

## 方案4：API直接测试

使用cURL或Postman测试API端点：

```bash
# 直接调用 /api/analysis/run
curl -X POST http://localhost:3000/api/analysis/run \
  -H "Content-Type: application/json" \
  -d '{
    "gift": {
      "name": "小米手机14",
      "description": "高端旗舰手机"
    },
    "country": "JP",
    "targetGroup": "colleague"
  }'
```

**响应示例**：
```json
{
  "analysis": {
    "scoreBreakdown": {...},
    "conclusionCards": [...],
    "riskAssessment": {...},
    "recommendations": [...]
  }
}
```

---

## 常见测试场景

### 场景1：完全成功路径
```
输入 → 国家选择 → 快速分析 → 完整报告
预期：1分钟内完成
```

### 场景2：超时场景
```
输入 → 国家选择 → 长时间分析 (>55s)
预期：显示"模型繁忙"提示，不中断
触发：180秒后才真正超时
```

### 场景3：特定国家风险
```
礼物：「红色手机」
国家：「中国」
预期：检测到颜色禁忌，显示警告
```

### 场景4：多语言
```
同一流程用 /zh 和 /en 语言各测一遍
预期：UI完全本地化，功能相同
```

---

## 调试技巧

### 1. 浏览器开发工具

```javascript
// 在控制台查看分析状态
window.__analysis = { /* 分析状态 */ }

// 模拟不同状态
localStorage.setItem('test_state', 'analyzing')  // 测试加载状态
localStorage.setItem('test_delay', '120000')     // 测试120秒延迟
```

### 2. 网络标签 (Network)

监控 `/api/analysis/run` 请求：
- 请求体 (Request)：验证发送的数据
- 响应体 (Response)：检查返回的分析结果
- 时间 (Timing)：确认响应延迟

### 3. 性能分析 (Performance)

```javascript
// 记录分析耗时
performance.mark('analysis-start')
// ... 分析过程
performance.mark('analysis-end')
performance.measure('analysis', 'analysis-start', 'analysis-end')
console.log(performance.getEntriesByName('analysis')[0])
```

### 4. 日志级别

在 `lib/dev/mock-data.ts` 中启用详细日志：
```typescript
const DEBUG = process.env.NODE_ENV === 'development'
if (DEBUG) console.log('Mock数据已加载:', mockGiftData)
```

---

## 部署前验收清单

```
□ 所有5个步骤都能正常加载
□ 输入验证工作正常（拒绝空值）
□ 国家列表显示正确
□ 分析能完成（通过mock或真实API）
□ 结果页面完整显示
□ 英文/中文切换正常
□ 移动设备上显示正常
□ 浏览器控制台无错误
□ API响应时间<180秒
□ 所有链接打开正确
```

---

## 关键文件

| 文件 | 用途 |
|------|------|
| `app/[locale]/gifting/page.tsx` | 主流程页面（已移除预览按钮） |
| `lib/dev/mock-data.ts` | Mock数据定义（新增） |
| `components/gifting/home/hooks/use-home-page-controller.tsx` | 状态管理 |
| `components/gifting/home/sections/results-section.tsx` | 结果展示 |
| `app/api/analysis/run/route.ts` | 分析API |

---

**总结**：
- ✅ 预览按钮已删除
- ✅ 推荐方案1：使用Mock数据快速测试
- ✅ 推荐方案2：E2E自动化测试
- ✅ 方案3/4：手动或API测试
