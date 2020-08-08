import http from '@/utils/http.js'

export class CommonApi {
  // 根据专业名称搜索
  static searchDisciplineName = (data) => http.getData('/api/discipline/list', data)

  // 获取专业目录
  static queryDisciplineList = (data) => http.getData('/api/discipline/listChild', data)

  // 根据专业检索职位列表
  static queryRecruitmentDataList = (data) => http.getData('/api/recruitmentData/list', data)
}