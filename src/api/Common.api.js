import http from '@/utils/http.js'

export class CommonApi {
  // 获取codeURL
  static getAuthorizeCodeUrl = (data) => http.getData('/api/wechat/getAuthorizeCodeUrl', data)

  // 根据code获取用户信息
  static getUserInfo = (data) => http.getData('/api/wechat/getUserInfo', data)

  // 根据专业名称搜索
  static searchDisciplineName = (data) => http.getData('/api/discipline/list', data)

  // 获取专业目录
  static queryDisciplineList = (data) => http.getData('/api/discipline/listChild', data)

  // 根据专业检索职位列表
  static queryRecruitmentDataList = (data) => http.getData('/api/recruitmentData/list', data)

  // 根据职位查询城市分布
  static listTotalArea = (data) => http.getData('/api/recruitmentData/listTotalArea', data)

  // 根据职位查询城市占比
  static listTotalCity = (data) => http.getData('/api/recruitmentData/listTotalCity', data)

  // 行业top5
  static listTotalIndustry = (data) => http.getData('/api/recruitmentData/listTotalIndustry', data)

  // 工作经验分布
  static workExperienceDistributed = (data) => http.getData('/api/recruitmentData/workExperienceDistributed', data)

  // 职位分布
  static listTotalPosition = (data) => http.getData('/api/recruitmentData/listTotalPosition', data)

  // 统计同届毕业人数，在聘职位数
  static listTotalNumber = (data) => http.getData('/api/recruitmentData/listTotalNumber', data)

  // 统计薪酬，最高、中位值、平均、实习
  static listTotalSalary = (data) => http.getData('/api/recruitmentData/listTotalSalary', data)

  // 城市薪酬top20
  static listTotalCitySalary = (data) => http.getData('/api/recruitmentData/listTotalCitySalary', data)

  // 工作经验平均薪酬
  static listTotalWorkingYearsSalaryAvg = (data) => http.getData('/api/recruitmentData/listTotalWorkingYearsSalaryAvg', data)

  // 行业薪酬
  static listTotalIndustrySalary = (data) => http.getData('/api/recruitmentData/listTotalIndustrySalary', data)

  // 数据分析
  static dataAnalysis = (data) => http.getData('/api/recruitmentData/dataAnalysis', data)

  // 职业要求
  static professionalRequirements = (data) => http.getData('/api/recruitmentData/professionalRequirements', data)
}