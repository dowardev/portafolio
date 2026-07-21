import { faker } from "@faker-js/faker"
import { ToastController } from "./toastController"
import StackController from "./stackController"
import TechController from "./techController"
import ExperienceController from "./experienceController"
import ProjectsController from "./projectsController"
import CertificatesController from "./certificatesController"
import FreelancePlatformController from "./freelancePlatformController"
import FreelanceCommentController from "./freelanceCommentController"
import IntroController from "./introController"
import SystemController from "./systemController"
import { getApiConnector } from "@/apiConnector"
import type { ExperienceItem, ProjectItem, CertificateItem, FreelancePlatform, FreelanceComment, TechnologyItem, TagItem } from "@/services/types"

export type SeedSection =
  | "info"
  | "skills"
  | "experience"
  | "projects"
  | "certificates"
  | "freelance-platform"
  | "freelance-comments"

interface SeedSectionInfo {
  section: SeedSection
  label: string
  success: boolean
  count: number
  action: "created" | "updated" | "cleared" | "error"
}

interface SeedSectionsParams {
  sections: SeedSection[]
}

const COMMON_ICONS = [
  "logoVue", "logoReact", "logoAngular", "logoNode", "logoPython",
  "logoLaravel", "logoGithub", "logoGitlab", "logoDocker", "logoAndroid",
  "logoApple", "logoChrome", "logoFigma", "logoHtml5", "logoCss3",
  "logoJavascript", "logoNpm", "logoYarn", "logoAmazon", "logoMicrosoft",
  "logoSlack", "logoStackoverflow", "logoTwitter", "logoVimeo", "logoSass",
]

const TECH_NAMES = ["React", "Vue", "Node", "Python", "TypeScript", "Go", "Rust", "Laravel", "Docker", "Kubernetes"]
const STATUSES = ["progress", "indeterminate", "finished"] as const

export default class SeedController {
  private toastController = new ToastController()
  private systemController = new SystemController()
  private stackController = new StackController()
  private techController = new TechController()
  private experienceController = new ExperienceController()
  private projectsController = new ProjectsController()
  private certificatesController = new CertificatesController()
  private freelancePlatformController = new FreelancePlatformController()
  private freelanceCommentController = new FreelanceCommentController()
  private introController = new IntroController()

  private pickIcon(): string {
    return faker.helpers.arrayElement(COMMON_ICONS)
  }

  private pickTechs(params: { min: number; max: number }): TechnologyItem[] {
    const { min, max } = params
    const names = faker.helpers.arrayElements(TECH_NAMES, { min, max })
    return names.map((name) => ({ iconName: name.toLowerCase() }))
  }

  private generateSkills(): Array<{ name: string; iconName: string; techs: Array<{ name: string; iconName: string }> }> {
    return [
      {
        name: "Frontend",
        iconName: "logoVue",
        techs: [
          { name: "Vue.js", iconName: "logoVue" },
          { name: "React", iconName: "logoReact" },
          { name: "TypeScript", iconName: "logoTypescript" },
        ],
      },
      {
        name: "Backend",
        iconName: "logoLaravel",
        techs: [
          { name: "Laravel", iconName: "logoLaravel" },
          { name: "Node.js", iconName: "logoNodejs" },
          { name: "Python", iconName: "logoPython" },
        ],
      },
      {
        name: "DevOps",
        iconName: "logoDocker",
        techs: [
          { name: "Docker", iconName: "logoDocker" },
          { name: "Kubernetes", iconName: "logoKubernetes" },
          { name: "PostgreSQL", iconName: "logoSql" },
        ],
      },
    ]
  }

  private generateExperiences(): ExperienceItem[] {
    return Array.from({ length: 3 }, () => {
      const techNames = faker.helpers.arrayElements(TECH_NAMES, { min: 2, max: 4 })
      return {
        id: crypto.randomUUID(),
        img: faker.image.url({ width: 100, height: 100 }),
        title: faker.company.name(),
        startDate: faker.date.past({ years: 2 }).toISOString(),
        endDate: faker.date.recent({ days: 100 }).toISOString(),
        technologies: techNames.map((name) => ({ iconName: name.toLowerCase() })),
        details: {
          description: faker.lorem.paragraph(),
          website: faker.internet.url(),
        },
      }
    })
  }

  private generateProjects(): ProjectItem[] {
    return Array.from({ length: 5 }, () => {
      const techNames = faker.helpers.arrayElements(TECH_NAMES, { min: 1, max: 3 })
      return {
        id: crypto.randomUUID(),
        img: faker.image.url({ width: 300, height: 200 }),
        title: faker.word.noun(),
        startDate: faker.date.past({ years: 1 }).toISOString(),
        endDate: faker.helpers.maybe(() => faker.date.recent({ days: 30 }).toISOString()),
        status: faker.helpers.arrayElement([...STATUSES]),
        technologies: techNames.map((name) => ({ iconName: name.toLowerCase() })),
        source: {
          name: "GitHub",
          url: faker.internet.url(),
        },
        details: {
          description: faker.lorem.paragraph(),
          website: faker.internet.url(),
        },
      }
    })
  }

  private generateCertificates(): CertificateItem[] {
    return Array.from({ length: 3 }, () => ({
      id: crypto.randomUUID(),
      img: faker.image.url({ width: 200, height: 200 }),
      title: faker.lorem.sentence({ min: 2, max: 4 }).replace(/\.$/, ""),
      url: faker.internet.url(),
      aptitudes: faker.helpers.arrayElements(
        ["JavaScript", "TypeScript", "Vue.js", "React", "Node.js", "Laravel", "Docker"],
        { min: 1, max: 3 },
      ).map((apt) => ({
        source: "icon",
        name: apt,
        type: "icon" as const,
        size: "medium",
      })),
    }))
  }

  private generateFreelancePlatforms(): FreelancePlatform[] {
    const names = ["Upwork", "Fiverr", "Freelancer.com"]
    return names.map((name) => ({
      id: crypto.randomUUID(),
      name,
      image: faker.image.url({ width: 100, height: 100 }),
      url: faker.internet.url(),
    }))
  }

  private generateFreelanceComments(): FreelanceComment[] {
    return Array.from({ length: 5 }, () => ({
      id: crypto.randomUUID(),
      title: faker.lorem.sentence({ min: 3, max: 8 }),
      text: faker.lorem.paragraph(),
      rating: faker.number.int({ min: 1, max: 5 }),
    }))
  }

  private generateTags(): TagItem[] {
    return [
      { name: "Desarrollador Full-Stack" },
      { name: "Ingeniero de Software" },
      { name: "Freelancer" },
    ]
  }

  private async showToast(params: { message: string; color?: string }) {
    const { message, color = "dark" } = params
    const toast = await this.toastController.presentToast({ message, color, duration: 2000 })
    await toast.present()
  }

  private async seedInfo(): Promise<SeedSectionInfo> {
    const result: SeedSectionInfo = { section: "info", label: "Info", success: false, count: 0, action: "created" }
    try {
      await this.introController.saveIntro({
        name: "Juan Pérez",
        username: "@juanperez",
        tags: this.generateTags(),
        description: "Desarrollador Full-Stack con más de 5 años de experiencia en el desarrollo de aplicaciones web y móviles. Especializado en Vue.js, Laravel y bases de datos relacionales.",
        socials: [
          { platform: "LinkedIn", url: "https://linkedin.com/in/juanperez", iconName: "logoLinkedin" },
          { platform: "GitHub", url: "https://github.com/juanperez", iconName: "logoGithub" },
          { platform: "Twitter", url: "https://twitter.com/juanperez", iconName: "logoTwitter" },
        ],
        logoUrl: null,
        photoUrl: null,
        showFooter: true,
        footerContent: faker.lorem.sentence({ min: 4, max: 8 }),
        showContactForm: { socials: true, freelance: true },
      })
      result.success = true
      result.count = 1
      result.action = "updated"
    } catch {
      result.success = false
    }
    return result
  }

  private assertSuccess(params: { ok: boolean; label: string }) {
    const { ok, label } = params
    if (!ok) throw new Error(`Error al crear ${label}`)
  }

  private async seedSkills(): Promise<SeedSectionInfo> {
    const result: SeedSectionInfo = { section: "skills", label: "Skills", success: false, count: 0, action: "created" }
    try {
      const api = getApiConnector()
      const existingRes = await api.get<{ stacks: Array<{ id: number; techs: Array<{ id: number }> }> }>("stacks")
      const existingStacks = existingRes.stacks || []

      if (existingStacks.length > 0) {
        const first = existingStacks[0]
        const gen = this.generateSkills()[0]

        await api.post(`admin/stacks/${first.id}`, { name: gen.name, icon_name: gen.iconName })

        for (const tech of first.techs || []) {
          if (tech.id) await api.delete(`admin/techs/${tech.id}`)
        }
        for (const tech of gen.techs) {
          await api.post("admin/techs", { name: tech.name, icon_name: tech.iconName, stack_id: Number(first.id) })
        }

        result.action = "updated"
        result.count = 1 + gen.techs.length
      } else {
        const stacks = this.generateSkills()
        let totalCount = 0
        for (const stack of stacks) {
          const created = await this.stackController.createStack({ name: stack.name, iconName: stack.iconName })
          if (!created?.id) throw new Error("Error al crear stack")
          for (const tech of stack.techs) {
            const techCreated = await this.techController.createTech({
              tech: { name: tech.name, iconName: tech.iconName, stackId: Number(created.id) },
            })
            if (!techCreated) throw new Error("Error al crear tech")
            totalCount++
          }
        }
        result.count = totalCount
      }
      result.success = true
    } catch {
      result.success = false
    }
    return result
  }

  private async seedExperience(): Promise<SeedSectionInfo> {
    const result: SeedSectionInfo = { section: "experience", label: "Experiencia", success: false, count: 0, action: "created" }
    try {
      const api = getApiConnector()
      const existingRes = await api.get<{ experiences: Array<{ id: string }> }>("experiences")
      const existing = existingRes.experiences || []

      if (existing.length > 0) {
        const first = existing[0]
        const gen = this.generateExperiences()[0]
        const formData = new FormData()
        formData.append("title", gen.title)
        formData.append("start_date", gen.startDate)
        if (gen.endDate) formData.append("end_date", gen.endDate)
        if (gen.details?.description) formData.append("description", gen.details.description)
        if (gen.details?.website) formData.append("website", gen.details.website)
        if (gen.technologies) formData.append("technologies", JSON.stringify(gen.technologies))
        await api.post(`admin/experiences/${first.id}`, formData)

        result.action = "updated"
        result.count = 1
      } else {
        const experiences = this.generateExperiences()
        for (const exp of experiences) {
          const ok = await this.experienceController.addExperience(exp)
          this.assertSuccess({ ok, label: "experiencia" })
        }
        result.count = experiences.length
      }
      result.success = true
    } catch {
      result.success = false
    }
    return result
  }

  private async seedProjects(): Promise<SeedSectionInfo> {
    const result: SeedSectionInfo = { section: "projects", label: "Proyectos", success: false, count: 0, action: "created" }
    try {
      const api = getApiConnector()
      const existingRes = await api.get<{ projects: Array<{ id: string }> }>("projects")
      const existing = existingRes.projects || []

      if (existing.length > 0) {
        const first = existing[0]
        const gen = this.generateProjects()[0]
        const formData = new FormData()
        formData.append("title", gen.title)
        if (gen.startDate) formData.append("start_date", gen.startDate)
        if (gen.endDate) formData.append("end_date", gen.endDate)
        else formData.append("end_date", "")
        if (gen.details?.description) formData.append("description", gen.details.description)
        if (gen.details?.website) formData.append("website", gen.details.website)
        if (gen.source?.name) formData.append("source_name", gen.source.name)
        if (gen.source?.url) formData.append("source_url", gen.source.url)
        if (gen.technologies) formData.append("technologies", JSON.stringify(gen.technologies))
        await api.post(`admin/projects/${first.id}`, formData)

        result.action = "updated"
        result.count = 1
      } else {
        const projects = this.generateProjects()
        for (const project of projects) {
          const ok = await this.projectsController.addProject(project)
          this.assertSuccess({ ok, label: "proyecto" })
        }
        result.count = projects.length
      }
      result.success = true
    } catch {
      result.success = false
    }
    return result
  }

  private async seedCertificates(): Promise<SeedSectionInfo> {
    const result: SeedSectionInfo = { section: "certificates", label: "Certificados", success: false, count: 0, action: "created" }
    try {
      const api = getApiConnector()
      const existingRes = await api.get<{ certificates: Array<{ id: string }> }>("certificates")
      const existing = existingRes.certificates || []

      if (existing.length > 0) {
        const first = existing[0]
        const gen = this.generateCertificates()[0]
        const formData = new FormData()
        formData.append("title", gen.title)
        if (gen.url) formData.append("url", gen.url)
        if (gen.aptitudes) formData.append("aptitudes", JSON.stringify(gen.aptitudes))
        await api.post(`admin/certificates/${first.id}`, formData)

        result.action = "updated"
        result.count = 1
      } else {
        const certificates = this.generateCertificates()
        for (const cert of certificates) {
          const ok = await this.certificatesController.addCertificate(cert)
          this.assertSuccess({ ok, label: "certificado" })
        }
        result.count = certificates.length
      }
      result.success = true
    } catch {
      result.success = false
    }
    return result
  }

  private async seedFreelancePlatforms(): Promise<SeedSectionInfo> {
    const result: SeedSectionInfo = { section: "freelance-platform", label: "Plataformas", success: false, count: 0, action: "created" }
    try {
      const api = getApiConnector()
      const existingRes = await api.get<{ freelancePlatforms: Array<{ id: number }> }>("freelance-platforms")
      const existing = existingRes.freelancePlatforms || []

      if (existing.length > 0) {
        const first = existing[0]
        const gen = this.generateFreelancePlatforms()[0]
        const formData = new FormData()
        formData.append("name", gen.name)
        if (gen.url) formData.append("url", gen.url)
        await api.post(`admin/freelance-platforms/${first.id}`, formData)

        result.action = "updated"
        result.count = 1
      } else {
        const platforms = this.generateFreelancePlatforms()
        for (const platform of platforms) {
          const ok = await this.freelancePlatformController.addFreelancePlatform(platform)
          this.assertSuccess({ ok, label: "plataforma" })
        }
        result.count = platforms.length
      }
      result.success = true
    } catch {
      result.success = false
    }
    return result
  }

  private async seedFreelanceComments(): Promise<SeedSectionInfo> {
    const result: SeedSectionInfo = { section: "freelance-comments", label: "Comentarios", success: false, count: 0, action: "created" }
    try {
      const api = getApiConnector()
      const existingRes = await api.get<{ freelanceComments: Array<{ id: number }> }>("freelance-comments")
      const existing = existingRes.freelanceComments || []

      if (existing.length > 0) {
        const first = existing[0]
        const gen = this.generateFreelanceComments()[0]
        await api.post(`admin/freelance-comments/${first.id}`, {
          title: gen.title,
          text: gen.text,
          rating: gen.rating,
        })

        result.action = "updated"
        result.count = 1
      } else {
        const comments = this.generateFreelanceComments()
        for (const comment of comments) {
          const ok = await this.freelanceCommentController.addFreelanceComment(comment)
          this.assertSuccess({ ok, label: "comentario" })
        }
        result.count = comments.length
      }
      result.success = true
    } catch {
      result.success = false
    }
    return result
  }

  private async clearInfo(): Promise<SeedSectionInfo> {
    const result: SeedSectionInfo = { section: "info", label: "Info", success: false, count: 0, action: "cleared" }
    try {
      const api = getApiConnector()
      const formData = new FormData()
      formData.append("intro", JSON.stringify({
        name: "",
        username: "",
        tags: [],
        description: "",
        socials: [],
        showFooter: false,
        footerContent: null,
        showContactForm: { socials: false, freelance: false },
      }))
      await api.post("admin/update-intro", formData)
      result.count = 1
      result.success = true
    } catch {
      result.success = false
    }
    return result
  }

  private async clearSkills(): Promise<SeedSectionInfo> {
    const result: SeedSectionInfo = { section: "skills", label: "Skills", success: false, count: 0, action: "cleared" }
    try {
      const api = getApiConnector()
      const stacksRes = await api.get<{ stacks: Array<{ id: number; techs: Array<{ id: number }> }> }>("stacks")
      const stacks = stacksRes.stacks || []
      let totalCount = 0
      for (const stack of stacks) {
        for (const tech of stack.techs || []) {
          if (tech.id) {
            await api.delete(`admin/techs/${tech.id}`)
            totalCount++
          }
        }
        await api.delete(`admin/stacks/${stack.id}`)
        totalCount++
      }
      result.count = totalCount
      result.success = true
    } catch {
      result.success = false
    }
    return result
  }

  private async clearExperiences(): Promise<SeedSectionInfo> {
    const result: SeedSectionInfo = { section: "experience", label: "Experiencia", success: false, count: 0, action: "cleared" }
    try {
      const api = getApiConnector()
      const existingRes = await api.get<{ experiences: Array<{ id: string }> }>("experiences")
      const items = existingRes.experiences || []
      for (const item of items) {
        await api.delete(`admin/experiences/${item.id}`)
      }
      result.count = items.length
      result.success = true
    } catch {
      result.success = false
    }
    return result
  }

  private async clearProjects(): Promise<SeedSectionInfo> {
    const result: SeedSectionInfo = { section: "projects", label: "Proyectos", success: false, count: 0, action: "cleared" }
    try {
      const api = getApiConnector()
      const existingRes = await api.get<{ projects: Array<{ id: string }> }>("projects")
      const items = existingRes.projects || []
      for (const item of items) {
        await api.delete(`admin/projects/${item.id}`)
      }
      result.count = items.length
      result.success = true
    } catch {
      result.success = false
    }
    return result
  }

  private async clearCertificates(): Promise<SeedSectionInfo> {
    const result: SeedSectionInfo = { section: "certificates", label: "Certificados", success: false, count: 0, action: "cleared" }
    try {
      const api = getApiConnector()
      const existingRes = await api.get<{ certificates: Array<{ id: string }> }>("certificates")
      const items = existingRes.certificates || []
      for (const item of items) {
        await api.delete(`admin/certificates/${item.id}`)
      }
      result.count = items.length
      result.success = true
    } catch {
      result.success = false
    }
    return result
  }

  private async clearFreelancePlatforms(): Promise<SeedSectionInfo> {
    const result: SeedSectionInfo = { section: "freelance-platform", label: "Plataformas", success: false, count: 0, action: "cleared" }
    try {
      const api = getApiConnector()
      const existingRes = await api.get<{ freelancePlatforms: Array<{ id: number }> }>("freelance-platforms")
      const items = existingRes.freelancePlatforms || []
      for (const item of items) {
        await api.delete(`admin/freelance-platforms/${item.id}`)
      }
      result.count = items.length
      result.success = true
    } catch {
      result.success = false
    }
    return result
  }

  private async clearFreelanceComments(): Promise<SeedSectionInfo> {
    const result: SeedSectionInfo = { section: "freelance-comments", label: "Comentarios", success: false, count: 0, action: "cleared" }
    try {
      const api = getApiConnector()
      const existingRes = await api.get<{ freelanceComments: Array<{ id: number }> }>("freelance-comments")
      const items = existingRes.freelanceComments || []
      for (const item of items) {
        await api.delete(`admin/freelance-comments/${item.id}`)
      }
      result.count = items.length
      result.success = true
    } catch {
      result.success = false
    }
    return result
  }

  private getSeedMethod(section: SeedSection): () => Promise<SeedSectionInfo> {
    const map: Record<SeedSection, () => Promise<SeedSectionInfo>> = {
      "info": () => this.seedInfo(),
      "skills": () => this.seedSkills(),
      "experience": () => this.seedExperience(),
      "projects": () => this.seedProjects(),
      "certificates": () => this.seedCertificates(),
      "freelance-platform": () => this.seedFreelancePlatforms(),
      "freelance-comments": () => this.seedFreelanceComments(),
    }
    return map[section]
  }

  private getClearMethod(section: SeedSection): () => Promise<SeedSectionInfo> {
    const map: Record<SeedSection, () => Promise<SeedSectionInfo>> = {
      "info": () => this.clearInfo(),
      "skills": () => this.clearSkills(),
      "experience": () => this.clearExperiences(),
      "projects": () => this.clearProjects(),
      "certificates": () => this.clearCertificates(),
      "freelance-platform": () => this.clearFreelancePlatforms(),
      "freelance-comments": () => this.clearFreelanceComments(),
    }
    return map[section]
  }

  async seedSections(params: SeedSectionsParams): Promise<void> {
    const { sections } = params
    if (sections.length === 0) return

    const loading = await this.systemController.presentLoading({ message: "Sembrando datos de prueba..." })
    if (loading) await loading.present()

    const results: SeedSectionInfo[] = []
    const total = sections.length
    const actionLabels: Record<string, string> = { created: "creados", updated: "actualizados", cleared: "eliminados" }

    for (let i = 0; i < total; i++) {
      const section = sections[i]
      const seedMethod = this.getSeedMethod(section)
      const result = await seedMethod()
      results.push(result)

      const icon = result.success ? "✅" : "❌"
      const actionLabel = result.action === "error" ? "Error" : `${result.count} ${actionLabels[result.action] || ""}`
      await this.showToast({ message: `${icon} ${result.label}: ${result.success ? actionLabel : "Error"}`, color: result.success ? "success" : "danger" })
    }

    if (loading) await loading.dismiss()

    const successes = results.filter((r) => r.success).length
    const totalCount = results.reduce((sum, r) => sum + (r.success ? r.count : 0), 0)
    const message = successes === total
      ? `✅ Datos insertados correctamente: ${totalCount} registros en ${successes} secciones`
      : `⚠️ ${successes}/${total} secciones completadas (${totalCount} registros)`

    await this.showToast({ message, color: successes === total ? "success" : "warning" })
  }

  async clearSections(params: SeedSectionsParams): Promise<void> {
    const { sections } = params
    if (sections.length === 0) return

    const loading = await this.systemController.presentLoading({ message: "Vaciando datos..." })
    if (loading) await loading.present()

    const results: SeedSectionInfo[] = []
    const total = sections.length

    for (let i = 0; i < total; i++) {
      const section = sections[i]
      const clearMethod = this.getClearMethod(section)
      const result = await clearMethod()
      results.push(result)

      const icon = result.success ? "✅" : "❌"
      await this.showToast({
        message: `${icon} ${result.label}: ${result.success ? `${result.count} eliminados` : "Error"}`,
        color: result.success ? "success" : "danger",
      })
    }

    if (loading) await loading.dismiss()

    const successes = results.filter((r) => r.success).length
    const totalCount = results.reduce((sum, r) => sum + (r.success ? r.count : 0), 0)
    const message = successes === total
      ? `✅ Datos eliminados correctamente: ${totalCount} registros en ${successes} secciones`
      : `⚠️ ${successes}/${total} secciones completadas (${totalCount} registros)`

    await this.showToast({ message, color: successes === total ? "success" : "warning" })
  }
}
