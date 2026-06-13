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
    const result: SeedSectionInfo = { section: "info", label: "Info", success: false, count: 0 }
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
        footerContent: null,
        showContactForm: { socials: true, freelance: true },
      })
      result.success = true
      result.count = 1
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
    const result: SeedSectionInfo = { section: "skills", label: "Skills", success: false, count: 0 }
    try {
      const stacks = this.generateSkills()
      let totalCount = 0
      for (const stack of stacks) {
        const created = await this.stackController.createStack({ name: stack.name, iconName: stack.iconName })
        if (!created?.id) throw new Error("Error al crear stack")
        for (const tech of stack.techs) {
          const techCreated = await this.techController.createTech({
            tech: {
              name: tech.name,
              iconName: tech.iconName,
              stackId: Number(created.id),
            },
          })
          if (!techCreated) throw new Error("Error al crear tech")
          totalCount++
        }
      }
      result.success = true
      result.count = totalCount
    } catch {
      result.success = false
    }
    return result
  }

  private async seedExperience(): Promise<SeedSectionInfo> {
    const result: SeedSectionInfo = { section: "experience", label: "Experiencia", success: false, count: 0 }
    try {
      const experiences = this.generateExperiences()
      for (const exp of experiences) {
        const ok = await this.experienceController.addExperience(exp)
        this.assertSuccess({ ok, label: "experiencia" })
      }
      result.success = true
      result.count = experiences.length
    } catch {
      result.success = false
    }
    return result
  }

  private async seedProjects(): Promise<SeedSectionInfo> {
    const result: SeedSectionInfo = { section: "projects", label: "Proyectos", success: false, count: 0 }
    try {
      const projects = this.generateProjects()
      for (const project of projects) {
        const ok = await this.projectsController.addProject(project)
        this.assertSuccess({ ok, label: "proyecto" })
      }
      result.success = true
      result.count = projects.length
    } catch {
      result.success = false
    }
    return result
  }

  private async seedCertificates(): Promise<SeedSectionInfo> {
    const result: SeedSectionInfo = { section: "certificates", label: "Certificados", success: false, count: 0 }
    try {
      const certificates = this.generateCertificates()
      for (const cert of certificates) {
        const ok = await this.certificatesController.addCertificate(cert)
        this.assertSuccess({ ok, label: "certificado" })
      }
      result.success = true
      result.count = certificates.length
    } catch {
      result.success = false
    }
    return result
  }

  private async seedFreelancePlatforms(): Promise<SeedSectionInfo> {
    const result: SeedSectionInfo = { section: "freelance-platform", label: "Plataformas", success: false, count: 0 }
    try {
      const platforms = this.generateFreelancePlatforms()
      for (const platform of platforms) {
        const ok = await this.freelancePlatformController.addFreelancePlatform(platform)
        this.assertSuccess({ ok, label: "plataforma" })
      }
      result.success = true
      result.count = platforms.length
    } catch {
      result.success = false
    }
    return result
  }

  private async seedFreelanceComments(): Promise<SeedSectionInfo> {
    const result: SeedSectionInfo = { section: "freelance-comments", label: "Comentarios", success: false, count: 0 }
    try {
      const comments = this.generateFreelanceComments()
      for (const comment of comments) {
        const ok = await this.freelanceCommentController.addFreelanceComment(comment)
        this.assertSuccess({ ok, label: "comentario" })
      }
      result.success = true
      result.count = comments.length
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

  async seedSections(params: SeedSectionsParams): Promise<void> {
    const { sections } = params
    if (sections.length === 0) return

    const loading = await this.systemController.presentLoading({ message: "Sembrando datos de prueba..." })
    if (loading) await loading.present()

    const results: SeedSectionInfo[] = []
    const total = sections.length

    for (let i = 0; i < total; i++) {
      const section = sections[i]
      const seedMethod = this.getSeedMethod(section)
      const result = await seedMethod()
      results.push(result)

      const icon = result.success ? "✅" : "❌"
      await this.showToast({ message: `${icon} ${result.label}: ${result.success ? `${result.count} registros` : "Error"}`, color: result.success ? "success" : "danger" })
    }

    if (loading) await loading.dismiss()

    const successes = results.filter((r) => r.success).length
    const totalCount = results.reduce((sum, r) => sum + (r.success ? r.count : 0), 0)
    const message = successes === total
      ? `✅ Datos insertados correctamente: ${totalCount} registros en ${successes} secciones`
      : `⚠️ ${successes}/${total} secciones completadas (${totalCount} registros)`

    await this.showToast({ message, color: successes === total ? "success" : "warning" })
  }
}
