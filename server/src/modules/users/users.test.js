import { afterEach, describe, expect, it, vi } from 'vitest';
import { AvatarBody, DirectoryQuery, MenteeProfileBody, MentorProfileBody, UpdateProfileBody } from '../../contracts/users.js';
import { usersRepository } from './users.repository.js';
import { usersService } from './users.service.js';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('users contracts and service', () => {
  it('validates profile update payloads', () => {
    const parsed = UpdateProfileBody.safeParse({
      firstName: 'Kojo',
      lastName: 'Prince',
      role: 'mentor',
    });
    expect(parsed.success).toBe(true);
  });

  it('updates the signed-in user profile', async () => {
    vi.spyOn(usersService, 'getById').mockResolvedValue({
      id: 'u1',
      email: 'kojo@example.com',
      first_name: 'Kojo',
      last_name: 'Prince',
      avatar_url: null,
      avatar_public_id: null,
      role: 'mentee',
      created_at: new Date().toISOString(),
    });
    vi.spyOn(usersRepository, 'deleteMenteeProfileByUserId').mockResolvedValue([]);
    vi.spyOn(usersRepository, 'updateProfile').mockResolvedValue([
      {
        id: 'u1',
        email: 'kojo@example.com',
        first_name: 'Kojo',
        last_name: 'Prince',
        avatar_url: null,
        avatar_public_id: null,
        role: 'mentor',
        created_at: new Date().toISOString(),
      },
    ]);

    const user = await usersService.updateProfile({
      id: 'u1',
      firstName: 'Kojo',
      lastName: 'Prince',
      role: 'mentor',
    });

    expect(user.role).toBe('mentor');
    expect(usersRepository.updateProfile).toHaveBeenCalledWith({
      id: 'u1',
      firstName: 'Kojo',
      lastName: 'Prince',
      role: 'mentor',
    });
  });

  it('rejects self-service promotion to admin', async () => {
    vi.spyOn(usersService, 'getById').mockResolvedValue({
      id: 'u1',
      email: 'kojo@example.com',
      first_name: 'Kojo',
      last_name: 'Prince',
      avatar_url: null,
      avatar_public_id: null,
      role: 'mentee',
      created_at: new Date().toISOString(),
    });

    await expect(
      usersService.updateProfile({
        id: 'u1',
        firstName: 'Kojo',
        lastName: 'Prince',
        role: 'admin',
      }),
    ).rejects.toThrow('Admin role cannot be self-assigned');
  });

  it('validates mentor onboarding payloads', () => {
    const parsed = MentorProfileBody.safeParse({
      title: 'Senior Frontend Engineer',
      bio: 'I help mentees grow in React.',
      experienceLevel: 'Senior',
      industries: ['Fintech'],
      cvUrl: 'https://example.com/cv.pdf',
      expertise: ['React', 'TypeScript'],
      careerPreferences: ['frontend'],
      languages: ['English'],
      availability: ['weekends'],
    });
    expect(parsed.success).toBe(true);
  });

  it('validates mentee onboarding payloads', () => {
    const parsed = MenteeProfileBody.safeParse({
      careerPath: 'frontend',
      goals: 'Land a junior frontend role.',
      experienceLevel: 'Entry',
      industryPreferences: ['SaaS'],
      educationStatus: 'Bootcamp graduate',
      desiredSkills: ['React', 'Testing'],
      languages: ['English'],
      availability: ['evenings'],
    });
    expect(parsed.success).toBe(true);
  });

  it('normalizes mentor profile arrays from stored procedures', async () => {
    vi.spyOn(usersRepository, 'getMentorProfileByUserId').mockResolvedValue([
      {
        user_id: 'u1',
        title: 'Mentor',
        bio: 'Bio',
        experience_level: 'Senior',
        industries: '["Fintech"]',
        cv_url: 'https://example.com/cv.pdf',
        expertise: '["React","TypeScript"]',
        career_preferences: '["frontend"]',
        languages: '["English"]',
        availability: '["weekends"]',
        updated_at: new Date().toISOString(),
      },
    ]);

    const profile = await usersService.getRoleProfile({ userId: 'u1', role: 'mentor' });
    expect(profile.expertise).toEqual(['React', 'TypeScript']);
    expect(profile.career_preferences).toEqual(['frontend']);
    expect(profile.industries).toEqual(['Fintech']);
  });

  it('upserts mentee onboarding data', async () => {
    vi.spyOn(usersRepository, 'upsertMenteeProfile').mockResolvedValue([
      {
        user_id: 'u2',
        career_path: 'frontend',
        goals: 'Become employable',
        experience_level: 'Entry',
        industry_preferences: '["SaaS"]',
        education_status: 'Bootcamp graduate',
        desired_skills: '["React"]',
        languages: '["English"]',
        availability: '["evenings"]',
        updated_at: new Date().toISOString(),
      },
    ]);

    const profile = await usersService.upsertRoleProfile({
      userId: 'u2',
      role: 'mentee',
      payload: {
        careerPath: 'frontend',
        goals: 'Become employable',
        experienceLevel: 'Entry',
        industryPreferences: ['SaaS'],
        educationStatus: 'Bootcamp graduate',
        desiredSkills: ['React'],
        languages: ['English'],
        availability: ['evenings'],
      },
    });

    expect(profile.desired_skills).toEqual(['React']);
    expect(usersRepository.upsertMenteeProfile).toHaveBeenCalled();
  });

  it('lists mentor directory entries with normalized arrays and display names', async () => {
    vi.spyOn(usersRepository, 'listMentorProfiles').mockResolvedValue([
      {
        id: 'mentor-1',
        email: 'mentor@example.com',
        first_name: 'Ava',
        last_name: 'Mensah',
        avatar_url: null,
        avatar_public_id: null,
        role: 'mentor',
        title: 'Senior Frontend Engineer',
        bio: 'Bio',
        experience_level: 'Senior',
        industries: '["Fintech"]',
        cv_url: 'https://example.com/cv.pdf',
        expertise: '["React","TypeScript"]',
        career_preferences: '["frontend"]',
        languages: '["English"]',
        availability: '["weekends"]',
        updated_at: new Date().toISOString(),
      },
    ]);

    const profiles = await usersService.listMentorProfiles({
      limit: 10,
      cursor: undefined,
      search: '',
      language: '',
      tag: '',
    });
    expect(profiles.items[0].name).toBe('Ava Mensah');
    expect(profiles.items[0].expertise).toEqual(['React', 'TypeScript']);
  });

  it('lists mentee directory entries with normalized arrays', async () => {
    vi.spyOn(usersRepository, 'listMenteeProfiles').mockResolvedValue([
      {
        id: 'mentee-1',
        email: 'mentee@example.com',
        first_name: 'Kojo',
        last_name: 'Asare',
        avatar_url: null,
        avatar_public_id: null,
        role: 'mentee',
        career_path: 'frontend',
        goals: 'Grow',
        experience_level: 'Entry',
        industry_preferences: '["SaaS"]',
        education_status: 'Bootcamp graduate',
        desired_skills: '["React"]',
        languages: '["English"]',
        availability: '["evenings"]',
        updated_at: new Date().toISOString(),
      },
    ]);

    const profiles = await usersService.listMenteeProfiles({
      limit: 10,
      cursor: undefined,
      search: '',
      language: '',
      tag: '',
    });
    expect(profiles.items[0].desired_skills).toEqual(['React']);
    expect(profiles.items[0].name).toBe('Kojo Asare');
  });

  it('validates avatar payloads and directory query contracts', () => {
    expect(
      AvatarBody.safeParse({
        avatarUrl: 'https://res.cloudinary.com/demo/image/upload/v1/avatar.jpg',
        avatarPublicId: 'dev2win/avatars/a1',
      }).success,
    ).toBe(true);
    expect(DirectoryQuery.safeParse({ limit: '12', search: 'react' }).success).toBe(true);
  });
});
